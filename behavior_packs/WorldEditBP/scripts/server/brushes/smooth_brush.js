import { Brush } from './base_brush.js';
import { CuboidShape } from '../shapes/cuboid.js';
import { smooth } from '../commands/region/smooth_func.js';
/**
 * This smooths the terrain in the world.
 */
export class SmoothBrush extends Brush {
    /**
    * @param radius The radius of the smoothing area
    * @param iterations The number of times the area is smoothed
    * @param mask determine what blocks affect the height map
    */
    constructor(radius, iterations, mask) {
        super();
        this.assertSizeInRange(radius);
        this.shape = new CuboidShape(radius * 2 + 1, radius * 2 + 1, radius * 2 + 1);
        this.size = radius;
        this.iterations = iterations;
        this.mask = mask;
    }
    resize(value) {
        this.assertSizeInRange(value);
        this.shape = new CuboidShape(value * 2 + 1, value * 2 + 1, value * 2 + 1);
        this.size = value;
        this.shape.usedInBrush = true;
    }
    paintWith(value) {
        throw 'commands.generic.wedit:noBrushMaterial';
    }
    *apply(loc, session, mask) {
        const point = loc.offset(-this.size, -this.size, -this.size);
        yield* smooth(session, this.iterations, this.shape, point, this.mask, mask);
    }
}
