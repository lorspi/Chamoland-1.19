import { Jobs } from './../../modules/jobs.js';
import { PlayerUtil } from './../../modules/player_util.js';
import { RawText } from './../../../library/Minecraft.js';
import { PyramidShape } from '../../shapes/pyramid.js';
import { registerCommand } from '../register_commands.js';
const registerInformation = {
    name: 'pyramid',
    permission: 'worldedit.generation.pyramid',
    description: 'commands.wedit:pyramid.description',
    usage: [
        {
            flag: 'h'
        }, {
            name: 'pattern',
            type: 'Pattern'
        }, {
            name: 'size',
            type: 'int',
            range: [1, null]
        }
    ]
};
registerCommand(registerInformation, function* (session, builder, args) {
    let pattern = args.get('pattern');
    let isHollow = args.has('h');
    let size = args.get('size');
    const loc = PlayerUtil.getBlockLocation(builder);
    const pyramidShape = new PyramidShape(size);
    const job = Jobs.startJob(session, 2, pyramidShape.getRegion(loc));
    const count = yield* Jobs.perform(job, pyramidShape.generate(loc, pattern, null, session, { 'hollow': isHollow }));
    Jobs.finishJob(job);
    return RawText.translate('commands.blocks.wedit:created').with(`${count}`);
});
