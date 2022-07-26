import { Tool } from './base_tool.js';
import { Tools } from './tool_manager.js';
import { PlayerUtil } from './../modules/player_util.js';
class BrushTool extends Tool {
    constructor(brush, mask) {
        super();
        this.range = null;
        this.mask = null;
        this.traceMask = null;
        this.permission = 'worldedit.brush';
        this.use = function* (self, player, session) {
            const hit = PlayerUtil.traceForBlock(player, self.range, self.traceMask);
            if (!hit) {
                throw 'commands.wedit:jumpto.none';
            }
            yield* self.brush.apply(hit, session, self.mask);
        };
        this.brush = brush;
        this.mask = mask;
    }
    set size(value) {
        this.brush.resize(value);
    }
    set material(value) {
        this.brush.paintWith(value);
    }
}
Tools.register(BrushTool, 'brush');
