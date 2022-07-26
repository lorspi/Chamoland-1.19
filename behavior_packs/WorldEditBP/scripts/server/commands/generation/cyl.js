import { Jobs } from './../../modules/jobs.js';
import { PlayerUtil } from './../../modules/player_util.js';
import { RawText } from './../../../library/Minecraft.js';
import { CylinderShape } from '../../shapes/cylinder.js';
import { registerCommand } from '../register_commands.js';
const registerInformation = {
    name: 'cyl',
    permission: 'worldedit.generation.cylinder',
    description: 'commands.wedit:cyl.description',
    usage: [
        {
            flag: 'h'
        }, {
            flag: 'r'
        }, {
            name: 'pattern',
            type: 'Pattern'
        }, {
            subName: '_x',
            args: [
                {
                    name: 'radii',
                    type: 'float',
                    range: [0.01, null]
                }, {
                    name: 'height',
                    type: 'int',
                    default: 1,
                    range: [1, null]
                }
            ]
        }, {
            subName: '_xz',
            args: [
                {
                    name: 'radiiX',
                    type: 'float',
                    range: [0.01, null]
                }, {
                    name: 'radiiZ',
                    type: 'float',
                    range: [0.01, null]
                }, {
                    name: 'height',
                    type: 'int',
                    default: 1,
                    range: [1, null]
                }
            ]
        }
    ]
};
registerCommand(registerInformation, function* (session, builder, args) {
    let pattern = args.get('pattern');
    let radii;
    let height = args.get('height');
    let isHollow = args.has('h');
    let isRaised = args.has('r');
    if (args.has('_x'))
        radii = [args.get('radii'), args.get('radii')];
    else
        radii = [args.get('radiiX'), args.get('radiiZ')];
    const loc = PlayerUtil.getBlockLocation(builder).offset(0, isRaised ? height / 2 : 0, 0);
    const cylShape = new CylinderShape(height, ...radii);
    const job = Jobs.startJob(session, 2, cylShape.getRegion(loc));
    const count = yield* Jobs.perform(job, cylShape.generate(loc, pattern, null, session, { 'hollow': isHollow }));
    Jobs.finishJob(job);
    return RawText.translate('commands.blocks.wedit:created').with(`${count}`);
});
