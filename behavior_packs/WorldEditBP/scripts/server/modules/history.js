import { MinecraftBlockTypes } from 'mojang-minecraft';
import { assertCanBuildWithin } from './assert.js';
import { canPlaceBlock } from '../util.js';
import { Vector, regionVolume, Server } from './../../library/Minecraft.js';
import { MAX_HISTORY_SIZE, HISTORY_MODE, BRUSH_HISTORY_MODE } from './../../config.js';
let historyId = 0;
let historyPointId = 0;
export class History {
    constructor(session) {
        this.historyPoints = new Map();
        this.undoStructures = [];
        this.redoStructures = [];
        this.selectionHistory = [];
        this.historyIdx = -1;
        this.session = session;
    }
    record(brush = false) {
        let historyPoint = {
            undo: [],
            redo: [],
            selection: 'none',
            blocksChanged: 0,
            brush
        };
        this.historyPoints.set(++historyPointId, historyPoint);
        return historyPointId;
    }
    commit(historyPoint) {
        const point = this.historyPoints.get(historyPoint);
        this.historyPoints.delete(historyPoint);
        if (point.brush && !BRUSH_HISTORY_MODE || !point.brush && !HISTORY_MODE) {
            return;
        }
        this.historyIdx++;
        for (let i = this.historyIdx; i < this.undoStructures.length; i++) {
            this.deleteHistoryRegions(i);
        }
        this.undoStructures.length = this.redoStructures.length = this.selectionHistory.length = this.historyIdx + 1;
        this.undoStructures[this.historyIdx] = point.undo;
        this.redoStructures[this.historyIdx] = point.redo;
        this.selectionHistory[this.historyIdx] = point.selection;
        while (this.historyIdx > MAX_HISTORY_SIZE - 1) {
            this.deleteHistoryRegions(0);
            this.undoStructures.shift();
            this.redoStructures.shift();
            this.selectionHistory.shift();
            this.historyIdx--;
        }
    }
    cancel(historyPoint) {
        if (!this.historyPoints.has(historyPoint))
            return;
        const point = this.historyPoints.get(historyPoint);
        this.historyPoints.delete(historyPoint);
        for (const struct of point.undo) {
            Server.structure.delete(struct.name);
        }
        for (const struct of point.redo) {
            Server.structure.delete(struct.name);
        }
    }
    addUndoStructure(historyPoint, start, end, blocks = 'any') {
        const point = this.historyPoints.get(historyPoint);
        point.blocksChanged += blocks == 'any' ? regionVolume(start, end) : blocks.length;
        // We test the change limit here,
        if (point.blocksChanged > this.session.changeLimit) {
            throw 'commands.generic.wedit:blockLimit';
        }
        if (point.brush && !BRUSH_HISTORY_MODE || !point.brush && !HISTORY_MODE) {
            return;
        }
        const structName = this.processRegion(historyPoint, start, end, blocks);
        point.undo.push({
            'name': structName,
            'location': Vector.min(start, end).toBlock()
        });
    }
    addRedoStructure(historyPoint, start, end, blocks = 'any') {
        const point = this.historyPoints.get(historyPoint);
        this.assertRecording();
        if (point.brush && !BRUSH_HISTORY_MODE || !point.brush && !HISTORY_MODE) {
            return;
        }
        const structName = this.processRegion(historyPoint, start, end, blocks);
        point.redo.push({
            'name': structName,
            'location': Vector.min(start, end).toBlock()
        });
    }
    recordSelection(historyPoint, session) {
        const point = this.historyPoints.get(historyPoint);
        if (point.selection == 'none') {
            point.selection = {
                type: session.selection.mode,
                points: session.selection.points
            };
        }
        else if ('points' in point.selection) {
            point.selection = [
                point.selection,
                {
                    type: session.selection.mode,
                    points: session.selection.points
                }
            ];
        }
        else {
            throw new Error('Cannot call "recordSelection" more than two times!');
        }
    }
    undo(session) {
        this.assertNotRecording();
        if (this.historyIdx <= -1) {
            return true;
        }
        const dim = this.session.getPlayer().dimension;
        for (const region of this.undoStructures[this.historyIdx]) {
            const pos = region.location;
            const size = Server.structure.getSize(region.name);
            assertCanBuildWithin(dim, pos, Vector.from(pos).add(size).sub(Vector.ONE).toBlock());
        }
        for (const region of this.undoStructures[this.historyIdx]) {
            Server.structure.load(region.name, region.location, dim);
        }
        let selection;
        if (Array.isArray(this.selectionHistory[this.historyIdx])) {
            selection = this.selectionHistory[this.historyIdx][0];
        }
        else if (this.selectionHistory[this.historyIdx] != 'none') {
            selection = this.selectionHistory[this.historyIdx];
        }
        if (selection) {
            session.selection.mode = selection.type;
            for (let i = 0; i < selection.points.length; i++) {
                session.selection.set(i == 0 ? 0 : 1, selection.points[i]);
            }
        }
        this.historyIdx--;
        return false;
    }
    redo(session) {
        this.assertNotRecording();
        if (this.historyIdx >= this.redoStructures.length - 1) {
            return true;
        }
        const dim = this.session.getPlayer().dimension;
        for (const region of this.redoStructures[this.historyIdx + 1]) {
            const pos = region.location;
            const size = Server.structure.getSize(region.name);
            assertCanBuildWithin(dim, pos, Vector.from(pos).add(size).sub(Vector.ONE).toBlock());
        }
        this.historyIdx++;
        for (const region of this.redoStructures[this.historyIdx]) {
            Server.structure.load(region.name, region.location, dim);
        }
        let selection;
        if (Array.isArray(this.selectionHistory[this.historyIdx])) {
            selection = this.selectionHistory[this.historyIdx][1];
        }
        else if (this.selectionHistory[this.historyIdx] != 'none') {
            selection = this.selectionHistory[this.historyIdx];
        }
        if (selection) {
            session.selection.mode = selection.type;
            for (let i = 0; i < selection.points.length; i++) {
                session.selection.set(i == 0 ? 0 : 1, selection.points[i]);
            }
        }
        return false;
    }
    clear() {
        this.historyIdx = -1;
        for (let i = 0; i < this.undoStructures.length; i++) {
            this.deleteHistoryRegions(i);
        }
        this.undoStructures.length = 0;
        this.redoStructures.length = 0;
    }
    isRecording() {
        return this.historyPoints.size != 0;
    }
    delete() {
        while (this.undoStructures.length) {
            this.deleteHistoryRegions(0);
        }
    }
    deleteHistoryRegions(index) {
        for (const struct of this.undoStructures[index]) {
            Server.structure.delete(struct.name);
        }
        for (const struct of this.redoStructures[index]) {
            Server.structure.delete(struct.name);
        }
    }
    processRegion(historyPoint, start, end, blocks) {
        const tempRegion = 'tempHistoryVoid';
        const point = this.historyPoints.get(historyPoint);
        let structName;
        const recordBlocks = Array.isArray(blocks) && (point.brush && BRUSH_HISTORY_MODE == 2 || !point.brush && HISTORY_MODE == 2);
        const player = this.session.getPlayer();
        const dim = player.dimension;
        const finish = () => {
            if (recordBlocks) {
                Server.structure.load(tempRegion, loc, dim);
                Server.structure.delete(tempRegion);
            }
        };
        try {
            if (!canPlaceBlock(start, dim) || !canPlaceBlock(end, dim)) {
                throw new Error('Failed to save history!');
            }
            // TODO: Get history precise recording working again
            // Assuming that `blocks` was made with `start.blocksBetween(end)` and then filtered.
            if (recordBlocks) {
                var loc = Vector.min(start, end).toBlock();
                const voidBlock = MinecraftBlockTypes.structureVoid.createDefaultBlockPermutation();
                Server.structure.save(tempRegion, start, end, dim);
                let index = 0;
                for (const block of start.blocksBetween(end)) {
                    if (blocks[index]?.equals(block)) {
                        index++;
                    }
                    else {
                        dim.getBlock(block).setPermutation(voidBlock);
                    }
                }
            }
            structName = 'wedit:history_' + (historyId++).toString(16);
            if (Server.structure.save(structName, start, end, dim)) {
                finish();
                this.cancel(historyPoint);
                throw new Error('Failed to save history!');
            }
        }
        catch (err) {
            finish();
            this.cancel(historyPoint);
            throw err;
        }
        finish();
        return structName;
    }
    assertRecording() {
        if (!this.isRecording()) {
            throw new Error('History was not being recorded!');
        }
    }
    assertNotRecording() {
        if (this.isRecording()) {
            throw new Error('History was still being recorded!');
        }
    }
}
