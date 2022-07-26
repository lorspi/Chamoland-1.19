import { RawText } from './../../library/Minecraft.js';
import { MinecraftBlockTypes } from 'mojang-minecraft';
import { Tool } from './base_tool.js';
import { Tools } from './tool_manager.js';
class PatternPickerTool extends Tool {
    constructor() {
        super(...arguments);
        this.useOn = function (self, player, session, loc) {
            const dimension = player.dimension;
            let addedToPattern = false;
            let block = dimension.getBlock(loc).permutation.clone();
            let blockName = block.type.id;
            if (player.isSneaking) {
                session.globalPattern.addBlock(block);
                addedToPattern = true;
            }
            else {
                session.globalPattern.clear();
                session.globalPattern.addBlock(block);
            }
            blockName += printBlockProperties(block);
            if (blockName.startsWith('minecraft:')) {
                blockName = blockName.slice('minecraft:'.length);
            }
            self.log(RawText.translate('worldedit.patternPicker.' + (addedToPattern ? 'add' : 'set'))
                .append('text', blockName));
        };
        this.use = function (self, player, session) {
            const dimension = player.dimension;
            let addedToPattern = true;
            if (!player.isSneaking) {
                session.globalPattern.clear();
                addedToPattern = false;
            }
            session.globalPattern.addBlock(MinecraftBlockTypes.air.createDefaultBlockPermutation());
            self.log(RawText.translate('worldedit.patternPicker.' + (addedToPattern ? 'add' : 'set'))
                .append('text', 'air'));
        };
    }
}
Tools.register(PatternPickerTool, 'pattern_picker', 'wedit:pattern_picker');
class MaskPickerTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = 'worldedit.global-mask';
        this.useOn = function (self, player, session, loc) {
            const dimension = player.dimension;
            let addedToPattern = false;
            let block = dimension.getBlock(loc).permutation.clone();
            let blockName = block.type.id;
            if (player.isSneaking) {
                session.globalMask.addBlock(block);
                addedToPattern = true;
            }
            else {
                session.globalMask.clear();
                session.globalMask.addBlock(block);
            }
            blockName += printBlockProperties(block);
            if (blockName.startsWith('minecraft:')) {
                blockName = blockName.slice('minecraft:'.length);
            }
            self.log(RawText.translate('worldedit.maskPicker.' + (addedToPattern ? 'add' : 'set'))
                .append('text', blockName));
        };
        this.use = function (self, player, session) {
            const dimension = player.dimension;
            let addedToPattern = true;
            if (!player.isSneaking) {
                session.globalMask.clear();
                addedToPattern = false;
            }
            session.globalMask.addBlock(MinecraftBlockTypes.air.createDefaultBlockPermutation());
            self.log(RawText.translate('worldedit.maskPicker.' + (addedToPattern ? 'add' : 'set'))
                .append('text', 'air'));
        };
    }
}
Tools.register(MaskPickerTool, 'mask_picker', 'wedit:mask_picker');
function printBlockProperties(block) {
    let propString = '';
    const properties = block.getAllProperties();
    if (properties.length && block.type.id != 'water' && block.type.id != 'lava') {
        for (let i = 0; i < properties.length; i++) {
            const prop = properties[i];
            if (prop.name.startsWith('wall_connection_type') || prop.name.startsWith('liquid_depth')) {
                continue;
            }
            propString += `\n§o${prop.name}§r: ${prop.value}`;
        }
    }
    return propString;
}
