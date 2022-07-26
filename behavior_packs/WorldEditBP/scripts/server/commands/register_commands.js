import { Server, Thread, Timer, contentLog } from './../../library/Minecraft.js';
import { getSession, hasSession } from '../sessions.js';
import { print, printerr } from '../util.js';
const commandList = new Map();
export function registerCommand(registerInformation, callback) {
    commandList.set(registerInformation.name, [registerInformation, callback]);
    Server.command.register(registerInformation, (data, args) => {
        const player = data.sender;
        if (!hasSession(player.name)) {
            data.cancel = false;
            return;
        }
        let toActionBar = getSession(player).usingItem;
        args.set('_using_item', getSession(player).usingItem);
        const thread = new Thread();
        thread.start(function* (msg, player, args) {
            const timer = new Timer();
            try {
                timer.start();
                contentLog.log(`Processing command '${msg}' for '${player.name}'`);
                let result;
                if (callback.constructor.name == 'GeneratorFunction') {
                    result = yield* callback(getSession(player), player, args);
                }
                else {
                    result = callback(getSession(player), player, args);
                }
                const time = timer.end();
                contentLog.log(`Time taken to execute: ${time}ms (${time / 1000.0} secs)`);
                print(result, player, toActionBar);
            }
            catch (e) {
                const errMsg = e.message ? `${e.name}: ${e.message}` : e;
                contentLog.error(`Command '${msg}' failed for '${player.name}' with msg: ${errMsg}`);
                printerr(errMsg, player, toActionBar);
                if (e.stack) {
                    printerr(e.stack, player, false);
                }
            }
        }, data.message, data.sender, args);
        return thread;
    });
}
export function getCommandFunc(command) {
    return commandList.get(command)[1];
}
export function getCommandInfo(command) {
    return commandList.get(command)[0];
}
