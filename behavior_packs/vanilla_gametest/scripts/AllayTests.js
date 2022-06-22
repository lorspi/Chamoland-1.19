import * as GameTest from "mojang-gametest";
import { BlockLocation, MinecraftItemTypes, TicksPerSecond, ItemStack, Location } from "mojang-minecraft";
import GameTestExtensions from "./GameTestExtensions.js";


GameTest.register("AllayTests", "allay_pickup_item", (test) => {
    const startPosAllay = new BlockLocation(1, 2, 1);
    const startPosPlayer = new BlockLocation(3, 2, 1);
    const torchItem = new ItemStack(MinecraftItemTypes.torch, 1, 0);
    test.spawnItem(torchItem, new Location(4.5, 2.5, 4.5));
    let playerSim = test.spawnSimulatedPlayer(startPosPlayer, "playerSim_allay");
    let allay = test.spawn("minecraft:allay", startPosAllay);
    const testEx = new GameTestExtensions(test);

    test
        .startSequence()
        .thenExecute(() => testEx.giveItem(playerSim, MinecraftItemTypes.torch, 1, 0))
        .thenExecute(() => test.assert(playerSim.interactWithEntity(allay) == true, ""))
        .thenWait(() => {
            test.assertEntityPresentInArea("minecraft:item", false); // Make sure the torch is picked up
        })
        .thenSucceed();
}).maxTicks(TicksPerSecond * 10).tag(GameTest.Tags.suiteDefault);
