import { Shape } from './base_shape.js';
export class ExpressionShape extends Shape {
    constructor(size, expr) {
        super();
        this.size = size;
        this.expr = expr;
    }
    getRegion(loc) {
        return [
            loc,
            loc.offset(this.size.x - 1, this.size.y - 1, this.size.z - 1)
        ];
    }
    getYRange(x, z) {
        throw Error('YRange not implemented');
        return [null, null];
    }
    prepGeneration(genVars, options) {
        genVars.hollow = options.hollow;
        genVars.neighbourOffsets = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
        genVars.func = this.expr.compile();
    }
    inShape(relLoc, genVars) {
        const getBlock = (offX, offY, offZ) => {
            const coords = [
                ((relLoc.x + offX) / Math.max(this.size.x - 1, 1)) * 2.0 - 1.0,
                ((relLoc.y + offY) / Math.max(this.size.y - 1, 1)) * 2.0 - 1.0,
                ((relLoc.z + offZ) / Math.max(this.size.z - 1, 1)) * 2.0 - 1.0
            ];
            const val = genVars.func(coords[0], coords[1], coords[2]);
            return val == true || val > 0;
        };
        let block = getBlock(0, 0, 0);
        if (genVars.hollow && block) {
            let neighbourCount = 0;
            for (const offset of genVars.neighbourOffsets) {
                neighbourCount += getBlock(...offset) ? 1 : 0;
            }
            return neighbourCount == 6 ? false : block;
        }
        else {
            return block;
        }
    }
}
