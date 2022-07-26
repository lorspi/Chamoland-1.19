import { Server, Thread } from './../../library/Minecraft.js';
import { print, printerr } from '../util.js';
/**
 * The base tool class for handling tools that WorldEdit builders may use.
 */
export class Tool {
    constructor() {
        this.useOnTick = 0;
        this.lastUse = Date.now();
    }
    log(message) {
        print(message, this.currentPlayer, true);
    }
    process(session, tick, loc) {
        const player = session.getPlayer();
        if (!loc && !this.use || loc && !this.useOn) {
            return false;
        }
        const onFail = (e) => {
            printerr(e.message ? `${e.name}: ${e.message}` : e, player, true);
            if (e.stack) {
                printerr(e.stack, player, false);
            }
        };
        new Thread().start(function* (self, player, session, loc) {
            self.currentPlayer = player;
            try {
                if (!Server.player.hasPermission(player, self.permission)) {
                    throw 'worldedit.tool.noPerm';
                }
                if (Date.now() - self.lastUse > 200) {
                    self.lastUse = Date.now();
                    if (!loc) {
                        if (self.useOnTick != tick) {
                            if (self.use.constructor.name == 'GeneratorFunction') {
                                yield* self.use(self, player, session);
                            }
                            else {
                                self.use(self, player, session);
                            }
                        }
                    }
                    else {
                        self.useOnTick = tick;
                        self.useOn(self, player, session, loc);
                    }
                }
            }
            catch (e) {
                onFail(e);
            }
            self.currentPlayer = null;
        }, this, player, session, loc);
        return true;
    }
}
