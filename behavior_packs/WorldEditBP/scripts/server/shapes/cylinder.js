import { Shape } from './base_shape.js';
export class CylinderShape extends Shape {
    constructor(height, radiusX, radiusZ) {
        super();
        this.radii = [0, 0];
        this.height = height;
        this.radii[0] = radiusX;
        this.radii[1] = radiusZ ?? this.radii[0];
    }
    getRegion(loc) {
        loc = loc.offset(0, -this.height / 2, 0);
        return [
            loc.offset(-this.radii[0], 0, -this.radii[1]),
            loc.offset(this.radii[0], this.height - 1, this.radii[1])
        ];
    }
    getYRange(x, z) {
        let [lX, lZ] = [
            x / (this.radii[0] + 0.5),
            z / (this.radii[1] + 0.5)
        ];
        return (lX * lX + lZ * lZ > 1.0) ? null : [-this.height / 2, this.height - 1 - this.height / 2];
    }
    prepGeneration(genVars, options) {
        genVars.isHollow = options?.hollow ?? false;
        genVars.radiiOff = this.radii.map(v => v + 0.5);
    }
    inShape(relLoc, genVars) {
        if (genVars.isHollow) {
            let hLocal = [
                relLoc.x / (genVars.radiiOff[0] - 1.0),
                relLoc.z / (genVars.radiiOff[1] - 1.0)
            ];
            if (hLocal[0] * hLocal[0] + hLocal[1] * hLocal[1] < 1.0) {
                return false;
            }
        }
        let local = [
            relLoc.x / genVars.radiiOff[0],
            relLoc.z / genVars.radiiOff[1]
        ];
        if (local[0] * local[0] + local[1] * local[1] <= 1.0) {
            return true;
        }
        return false;
    }
}
