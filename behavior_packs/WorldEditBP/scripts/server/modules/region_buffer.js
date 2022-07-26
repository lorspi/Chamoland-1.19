import { contentLog, generateId, iterateChunk, regionIterateBlocks, regionSize, regionTransformedBounds, regionVolume, Server, Vector } from "./../../library/Minecraft.js";
import { BlockLocation, BlockPermutation } from "mojang-minecraft";
import { locToString, stringToLoc } from "../util.js";
// TODO: Record entities
export class RegionBuffer {
    constructor(isAccurate = false) {
        this.size = new BlockLocation(0, 0, 0);
        this.blocks = new Map();
        this.blockCount = 0;
        this.subId = 0;
        this.isAccurate = isAccurate;
        this.id = 'wedit:buffer_' + generateId();
        contentLog.debug('creating structure', this.id);
    }
    save(start, end, dim, options = {}, blocks = 'all') {
        const save = this.saveProgressive(start, end, dim, options, blocks);
        while (!save.next().done)
            continue;
        return save.next().value;
    }
    *saveProgressive(start, end, dim, options = {}, blocks = 'all') {
        if (this.isAccurate) {
            const min = Vector.min(start, end);
            const iterate = (blockLoc) => {
                const relLoc = Vector.sub(blockLoc, min).toBlock();
                let id = this.id + '_' + this.subId++;
                Server.structure.save(id, blockLoc, blockLoc, dim);
                this.blocks.set(locToString(relLoc), [id, dim.getBlock(blockLoc).permutation.clone()]);
            };
            if (blocks == 'all') {
                const volume = regionVolume(start, end);
                let i = 0;
                for (const block of regionIterateBlocks(start, end)) {
                    iterate(block);
                    if (iterateChunk())
                        yield i / volume;
                    i++;
                }
            }
            else {
                for (let i = 0; i < blocks.length; i++) {
                    iterate(blocks[i]);
                    if (iterateChunk())
                        yield i / blocks.length;
                }
            }
            this.blockCount = blocks.length;
        }
        else {
            if (Server.structure.save(this.id, start, end, dim, options)) {
                return true;
            }
            this.blockCount = regionVolume(start, end);
        }
        this.size = regionSize(start, end);
        return false;
    }
    load(loc, dim, options) {
        const load = this.loadProgressive(loc, dim, options);
        while (!load.next().done)
            continue;
        return load.next().value;
    }
    *loadProgressive(loc, dim, options = {}) {
        const rotFlip = [options.rotation ?? Vector.ZERO, options.flip ?? Vector.ONE];
        if (this.isAccurate) {
            const bounds = regionTransformedBounds(new BlockLocation(0, 0, 0), Vector.sub(this.size, [1, 1, 1]).toBlock(), Vector.ZERO, ...rotFlip);
            const shouldTransform = options.rotation || options.flip;
            let transform;
            if (shouldTransform) {
                transform = block => {
                    let newBlock = block.clone();
                    const blockName = newBlock.type.id;
                    const attachement = newBlock.getProperty('attachement');
                    const direction = newBlock.getProperty('direction');
                    const doorHingeBit = newBlock.getProperty('door_hinge_bit');
                    const facingDir = newBlock.getProperty('facing_direction');
                    const groundSignDir = newBlock.getProperty('ground_sign_direction');
                    const openBit = newBlock.getProperty('open_bit');
                    const pillarAxis = newBlock.getProperty('pillar_axis');
                    const topSlotBit = newBlock.getProperty('top_slot_bit');
                    const upsideDownBit = newBlock.getProperty('upside_down_bit');
                    const weirdoDir = newBlock.getProperty('weirdo_direction');
                    if (upsideDownBit && openBit && direction) {
                        const states = this.transformMapping(mappings.trapdoorMap, `${upsideDownBit.value}_${openBit.value}_${direction.value}`, ...rotFlip).split('_');
                        [upsideDownBit.value, openBit.value, direction.value] = [states[0] == 'true', states[1] == 'true', parseInt(states[2])];
                    }
                    else if (weirdoDir && upsideDownBit) {
                        const states = this.transformMapping(mappings.stairsMap, `${upsideDownBit.value}_${weirdoDir.value}`, ...rotFlip).split('_');
                        [upsideDownBit.value, weirdoDir.value] = [states[0] == 'true', parseInt(states[1])];
                    }
                    else if (doorHingeBit && direction) {
                        const states = this.transformMapping(mappings.doorMap, `${doorHingeBit.value}_${direction.value}`, ...rotFlip).split('_');
                        [doorHingeBit.value, direction.value] = [states[0] == 'true', parseInt(states[1])];
                    }
                    else if (attachement && direction) {
                        const states = this.transformMapping(mappings.bellMap, `${attachement.value}_${direction.value}`, ...rotFlip).split('_');
                        [attachement.value, direction.value] = [states[0], parseInt(states[1])];
                    }
                    else if (facingDir) {
                        const state = this.transformMapping(mappings.facingDirectionMap, facingDir.value, ...rotFlip);
                        facingDir.value = parseInt(state);
                    }
                    else if (direction) {
                        const mapping = blockName.includes('powered_repeater') || blockName.includes('powered_comparator') ? mappings.redstoneMap : mappings.directionMap;
                        const state = this.transformMapping(mapping, direction.value, ...rotFlip);
                        direction.value = parseInt(state);
                    }
                    else if (groundSignDir) {
                        const state = this.transformMapping(mappings.groundSignDirectionMap, groundSignDir.value, ...rotFlip);
                        groundSignDir.value = parseInt(state);
                    }
                    else if (pillarAxis) {
                        const state = this.transformMapping(mappings.pillarAxisMap, pillarAxis.value + '_0', ...rotFlip);
                        pillarAxis.value = state[0];
                    }
                    else if (topSlotBit) {
                        const state = this.transformMapping(mappings.topSlotMap, String(topSlotBit.value), ...rotFlip);
                        topSlotBit.value = state == 'true';
                    }
                    return newBlock;
                };
            }
            else {
                transform = block => block;
            }
            let i = 0;
            for (const [key, block] of this.blocks.entries()) {
                let blockLoc = stringToLoc(key);
                if (shouldTransform) {
                    blockLoc = Vector.from(blockLoc)
                        .rotateY(rotFlip[0].y).rotateX(rotFlip[0].x).rotateZ(rotFlip[0].z)
                        .mul(rotFlip[1]).sub(bounds[0]).toBlock();
                }
                blockLoc = blockLoc.offset(loc.x, loc.y, loc.z);
                if (block instanceof BlockPermutation) {
                    dim.getBlock(blockLoc).setPermutation(transform(block));
                }
                else {
                    Server.structure.load(block[0], blockLoc, dim);
                    dim.getBlock(blockLoc).setPermutation(transform(block[1]));
                }
                if (iterateChunk())
                    yield i / this.blocks.size;
                i++;
            }
        }
        else {
            const loadOptions = {
                rotation: rotFlip[0].y,
                flip: 'none'
            };
            if (options.flip?.z == -1)
                loadOptions.flip = 'x';
            if (options.flip?.x == -1)
                loadOptions.flip += 'z';
            yield 1;
            return Server.structure.load(this.id, loc, dim, loadOptions);
        }
    }
    getSize() {
        return this.size;
    }
    getBlockCount() {
        return this.blockCount;
    }
    getBlock() {
    }
    getBlocks() {
        return Array.from(this.blocks.values());
    }
    setBlock(loc, block, options) {
        let error = false;
        const key = locToString(loc);
        if (this.blocks.has(key) && Array.isArray(this.blocks.get(key))) {
            Server.structure.delete(this.blocks.get(key)[0]);
        }
        if (block instanceof BlockPermutation) {
            if (options?.includeEntities) {
                let id = this.id + '_' + this.subId++;
                error = Server.structure.save(id, options.loc, options.loc, options.dim, options);
                this.blocks.set(key, [id, block]);
            }
            else {
                this.blocks.set(key, block);
            }
        }
        else {
            let id = this.id + '_' + this.subId++;
            error = Server.structure.save(id, block.location, block.location, block.dimension, options);
            this.blocks.set(key, [id, block.permutation.clone()]);
        }
        this.size = Vector.max(this.size, Vector.from(loc).add(1)).toBlock();
        this.blockCount = this.blocks.size;
        return error;
    }
    delete() {
        if (this.isAccurate) {
            for (const block of this.blocks.values()) {
                if (!(block instanceof BlockPermutation)) {
                    Server.structure.delete(block[0]);
                }
            }
        }
        else {
            Server.structure.delete(this.id);
        }
        contentLog.debug('deleted structure', this.id);
    }
    transformMapping(mapping, state, rotate, flip) {
        let vec = mapping[state];
        vec = vec.rotateY(rotate.y).rotateX(rotate.x).rotateZ(rotate.z);
        vec = vec.mul(flip);
        let closestState;
        let closestDot = -1000;
        for (const newState in mapping) {
            const dot = mapping[newState].dot(vec);
            if (dot > closestDot) {
                closestState = newState;
                closestDot = dot;
            }
        }
        return closestState;
    }
}
const mappings = {
    topSlotMap: {
        false: new Vector(0, 1, 0),
        true: new Vector(0, -1, 0),
    },
    redstoneMap: {
        0: new Vector(0, 0, -1),
        1: new Vector(1, 0, 0),
        2: new Vector(0, 0, 1),
        3: new Vector(-1, 0, 0)
    },
    directionMap: {
        0: new Vector(1, 0, 0),
        1: new Vector(0, 0, 1),
        2: new Vector(-1, 0, 0),
        3: new Vector(0, 0, -1)
    },
    facingDirectionMap: {
        0: new Vector(0, -1, 0),
        1: new Vector(0, 1, 0),
        2: new Vector(0, 0, -1),
        3: new Vector(0, 0, 1),
        4: new Vector(-1, 0, 0),
        5: new Vector(1, 0, 0)
    },
    pillarAxisMap: {
        x_0: new Vector(1, 0, 0),
        y_0: new Vector(0, 1, 0),
        z_0: new Vector(0, 0, 1),
        x_1: new Vector(-1, 0, 0),
        y_1: new Vector(0, -1, 0),
        z_1: new Vector(0, 0, -1)
    },
    groundSignDirectionMap: {
        0: new Vector(0, 0, 1),
        1: new Vector(0, 0, 1).rotateY(1 / 16 * 360),
        2: new Vector(0, 0, 1).rotateY(2 / 16 * 360),
        3: new Vector(0, 0, 1).rotateY(3 / 16 * 360),
        4: new Vector(0, 0, 1).rotateY(4 / 16 * 360),
        5: new Vector(0, 0, 1).rotateY(5 / 16 * 360),
        6: new Vector(0, 0, 1).rotateY(6 / 16 * 360),
        7: new Vector(0, 0, 1).rotateY(7 / 16 * 360),
        8: new Vector(0, 0, 1).rotateY(8 / 16 * 360),
        9: new Vector(0, 0, 1).rotateY(9 / 16 * 360),
        10: new Vector(0, 0, 1).rotateY(10 / 16 * 360),
        11: new Vector(0, 0, 1).rotateY(11 / 16 * 360),
        12: new Vector(0, 0, 1).rotateY(12 / 16 * 360),
        13: new Vector(0, 0, 1).rotateY(13 / 16 * 360),
        14: new Vector(0, 0, 1).rotateY(14 / 16 * 360),
        15: new Vector(0, 0, 1).rotateY(15 / 16 * 360),
    },
    stairsMap: {
        false_0: new Vector(-1, 1, 0),
        false_1: new Vector(1, 1, 0),
        false_2: new Vector(0, 1, -1),
        false_3: new Vector(0, 1, 1),
        true_0: new Vector(-1, -1, 0),
        true_1: new Vector(1, -1, 0),
        true_2: new Vector(0, -1, -1),
        true_3: new Vector(0, -1, 1)
    },
    doorMap: {
        false_0: new Vector(1, 0, 0.5),
        false_1: new Vector(-0.5, 0, 1),
        false_2: new Vector(-1, 0, -0.5),
        false_3: new Vector(0.5, 0, -1),
        true_0: new Vector(1, 0, -0.5),
        true_1: new Vector(0.5, 0, 1),
        true_2: new Vector(-1, 0, 0.5),
        true_3: new Vector(-0.5, 0, -1)
    },
    bellMap: {
        standing_0: new Vector(1, 0.5, 0),
        standing_1: new Vector(0, 0.5, 1),
        standing_2: new Vector(-1, 0.5, 0),
        standing_3: new Vector(0, 0.5, -1),
        side_0: new Vector(1, 0, 0),
        side_1: new Vector(0, 0, 1),
        side_2: new Vector(-1, 0, 0),
        side_3: new Vector(0, 0, -1),
        hanging_0: new Vector(1, -0.5, 0),
        hanging_1: new Vector(0, -0.5, 1),
        hanging_2: new Vector(-1, -0.5, 0),
        hanging_3: new Vector(0, -0.5, -1)
    },
    trapdoorMap: {
        false_false_0: new Vector(-0.5, 1, 0),
        false_false_1: new Vector(0.5, 1, 0),
        false_false_2: new Vector(0, 1, -0.5),
        false_false_3: new Vector(0, 1, 0.5),
        true_false_0: new Vector(-0.5, -1, 0),
        true_false_1: new Vector(0.5, -1, 0),
        true_false_2: new Vector(0, -1, -0.5),
        true_false_3: new Vector(0, -1, 0.5),
        false_true_0: new Vector(-1, 0.5, 0),
        false_true_1: new Vector(1, 0.5, 0),
        false_true_2: new Vector(0, 0.5, -1),
        false_true_3: new Vector(0, 0.5, 1),
        true_true_0: new Vector(-1, -0.5, 0),
        true_true_1: new Vector(1, -0.5, 0),
        true_true_2: new Vector(0, -0.5, -1),
        true_true_3: new Vector(0, -0.5, 1)
    },
    // TODO: Support glow lychen
};
