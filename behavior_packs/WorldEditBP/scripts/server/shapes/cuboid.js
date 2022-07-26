import { Shape } from './base_shape.js';
export class CuboidShape extends Shape {
    constructor(length, width, depth) {
        super();
        this.size = [0, 0, 0];
        this.size = [length, width, depth];
    }
    getRegion(loc) {
        return [
            loc,
            loc.offset(this.size[0] - 1, this.size[1] - 1, this.size[2] - 1)
        ];
    }
    getYRange(x, z) {
        return [0, this.size[1] - 1];
    }
    prepGeneration(genVars, options) {
        genVars.isHollow = options?.hollow ?? false;
        genVars.isWall = options?.wall ?? false;
        genVars.end = this.size.map(v => v - 1);
        if (!genVars.isHollow && !genVars.isWall) {
            genVars.isSolidCuboid = true;
        }
    }
    inShape(relLoc, genVars) {
        const end = genVars.end;
        if (genVars.isHollow &&
            relLoc.x > 0 && relLoc.x < end[0] &&
            relLoc.y > 0 && relLoc.y < end[1] &&
            relLoc.z > 0 && relLoc.z < end[2]) {
            return false;
        }
        else if (genVars.isWall &&
            relLoc.x > 0 && relLoc.x < end[0] &&
            relLoc.z > 0 && relLoc.z < end[2]) {
            return false;
        }
        return true;
    }
}
