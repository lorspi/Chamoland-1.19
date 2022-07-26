import { Vector } from "./../Minecraft.js";
import { world } from "mojang-minecraft";
export function addTickingArea(start, end, dimension, name, preload = false) {
    try {
        dimension.runCommand(`tickingarea add ${Vector.from(start).print()} ${Vector.from(end).print()} ${name} ${preload}`);
        return true;
    }
    catch (err) {
        return false;
    }
}
export function removeTickingArea(name) {
    try {
        world.getDimension('overworld').runCommand(`tickingarea remove ${name}`);
        return true;
    }
    catch (err) {
        return false;
    }
}
export function listTickingAreas(dimension) {
    try {
        const cmd = (dimension ?? world.getDimension('overworld')).runCommand(`tickingarea list ${dimension ? '' : 'all-dimensions'}`).statusMessage;
        const areas = [];
        for (const line of cmd.split('\n')) {
            if (line.startsWith('-')) {
                const match = line.match(/- (.+): (.+) to (.+)/);
                areas.push(match[1]);
            }
        }
        return areas;
    }
    catch (err) {
        return [];
    }
}
