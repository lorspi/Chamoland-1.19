import { Brush } from './base_brush.js';
import { CylinderShape } from '../shapes/cylinder.js';
/**
 * This brush creates cylinder shaped patterns in the world.
 */
export class CylinderBrush extends Brush {
    /**
    * @param radius The radius of the cylinders
    * @param height The height of the cylinders
    * @param pattern The pattern the cylinders will be made of
    * @param hollow Whether the cylinders will be made hollow
    */
    constructor(radius, height, pattern, hollow) {
        super();
        this.assertSizeInRange(radius);
        this.shape = new CylinderShape(height, radius);
        this.shape.usedInBrush = true;
        this.height = height;
        this.pattern = pattern;
        this.hollow = hollow;
    }
    resize(value) {
        this.assertSizeInRange(value);
        this.shape = new CylinderShape(this.height, value);
        this.shape.usedInBrush = true;
    }
    paintWith(value) {
        this.pattern = value;
    }
    *apply(loc, session, mask) {
        yield* this.shape.generate(loc, this.pattern, mask, session, { 'hollow': this.hollow });
    }
}
