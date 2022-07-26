import { Tool } from './base_tool.js';
import { Tools } from './tool_manager.js';
import { Server } from './../../library/Minecraft.js';
class SelectionTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = 'worldedit.selection.pos';
        this.useOn = function (self, player, session, loc) {
            session.usingItem = true;
            Server.command.callCommand(player, player.isSneaking ? 'pos1' : 'pos2', [`${loc.x}`, `${loc.y}`, `${loc.z}`]);
            session.usingItem = false;
        };
    }
}
Tools.register(SelectionTool, 'selection_wand');
class FarSelectionTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = 'worldedit.selection.hpos';
        this.use = function (self, player, session) {
            session.usingItem = true;
            Server.command.callCommand(player, player.isSneaking ? 'hpos1' : 'hpos2');
            session.usingItem = false;
        };
    }
}
Tools.register(FarSelectionTool, 'far_selection_wand');
