import { regionIterateBlocks, Server } from './../../../library/Minecraft.js';
import { copy } from './copy.js';
import { set } from '../region/set.js';
import { registerCommand } from '../register_commands.js';
import { assertCuboidSelection, assertCanBuildWithin } from './../../modules/assert.js';
import { Pattern } from './../../modules/pattern.js';
import { RawText } from './../../../library/Minecraft.js';
import { Jobs } from './../../modules/jobs.js';
const registerInformation = {
    name: 'cut',
    permission: 'worldedit.clipboard.cut',
    description: 'commands.wedit:cut.description',
    usage: [
        {
            flag: 'a'
        }, {
            flag: 'e'
        }, {
            name: 'fill',
            type: 'Pattern',
            default: new Pattern('air')
        }, {
            flag: 'm',
            name: 'mask',
            type: 'Mask'
        }
    ]
};
registerCommand(registerInformation, function* (session, builder, args) {
    assertCuboidSelection(session);
    const dim = builder.dimension;
    const [start, end] = session.selection.getRange();
    assertCanBuildWithin(dim, start, end);
    const history = session.getHistory();
    const record = history.record();
    const job = Jobs.startJob(session, 2, [start, end]);
    try {
        history.recordSelection(record, session);
        history.addUndoStructure(record, start, end, 'any');
        if (yield* Jobs.perform(job, copy(session, args), false)) {
            throw RawText.translate('commands.generic.wedit:commandFail');
        }
        let pattern = args.get('fill');
        let mask = args.has('m') ? args.get('m-mask') : undefined;
        let includeEntities = args.get('_using_item') ? session.includeEntities : args.has('e');
        yield* Jobs.perform(job, set(session, pattern, mask, false), false);
        if (includeEntities) {
            for (const block of regionIterateBlocks(start, end)) {
                for (const entity of dim.getEntitiesAtBlockLocation(block)) {
                    entity.nameTag = 'wedit:marked_for_deletion';
                }
            }
            Server.runCommand('execute @e[name=wedit:marked_for_deletion] ~~~ tp @s ~ -256 ~', dim);
            Server.runCommand('kill @e[name=wedit:marked_for_deletion]', dim);
        }
        history.addRedoStructure(record, start, end, 'any');
        history.commit(record);
    }
    catch (e) {
        history.cancel(record);
        throw e;
    }
    finally {
        Jobs.finishJob(job);
    }
    return RawText.translate('commands.wedit:cut.explain').with(`${session.selection.getBlockCount()}`);
});
