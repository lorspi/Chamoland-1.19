import { MAX_BRUSH_RADIUS } from './../../config.js';
import { RawText } from './../../library/Minecraft.js';
/**
 * This class is the base for all brush types available in WorldEdit.
 */
export class Brush {
    assertSizeInRange(size) {
        if (size > MAX_BRUSH_RADIUS) {
            throw RawText.translate('commands.wedit:brush.tooLarge').with(MAX_BRUSH_RADIUS);
        }
    }
}
