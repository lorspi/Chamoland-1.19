import { printLocation } from '../../util.js';
import { registerCommand } from '../register_commands.js';
import { RawText, CommandPosition, Vector } from './../../../library/Minecraft.js';
const registerInformation = {
    name: 'pos2',
    permission: 'worldedit.selection.pos',
    description: 'commands.wedit:pos2.description',
    usage: [
        {
            name: 'coordinates',
            type: 'xyz',
            default: new CommandPosition()
        }
    ],
    aliases: ['2']
};
export function setPos2(selection, loc) {
    const prevPoints = selection.points;
    selection.set(1, loc);
    if (selection.points.some((loc, idx) => !loc || !prevPoints[idx] || !loc.equals(prevPoints[idx]))) {
        let translate;
        const blockCount = selection.getBlockCount();
        if (!blockCount) {
            translate = `worldedit.selection.${selection.mode}.secondary`;
        }
        else {
            translate = `worldedit.selection.${selection.mode}.secondaryArea`;
        }
        let sub = printLocation(selection.points[1]);
        if (selection.mode == 'sphere') {
            sub = `${Math.round(Vector.sub(selection.points[1], selection.points[0]).length)}`;
        }
        return RawText.translate(translate)
            .with(sub)
            .with(`${blockCount}`);
    }
    return '';
}
registerCommand(registerInformation, function (session, builder, args) {
    return setPos2(session.selection, args.get('coordinates').relativeTo(builder, true));
});
