import "scripts/AgentTests.js";
import "scripts/BlockTests.js";

import { system } from "mojang-minecraft";
system.events.beforeWatchdogTerminate.subscribe((e) => {
  e.cancel = true;
});
