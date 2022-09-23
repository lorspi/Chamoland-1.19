import * as GameTest from "mojang-gametest";
import { BlockLocation, MinecraftBlockTypes, MinecraftItemTypes, Location } from "mojang-minecraft";
import GameTestExtensions from "./GameTestExtensions.js";

const TicksPerSecond = 20;
function toTicks(sec) {
  return sec * TicksPerSecond;
}

function locactionToString(loc) {
  return `<${loc.x}, ${loc.y}, ${loc.z}>`;
}

GameTest.registerAsync("BlockTests", "player_border_block_break", async (test) => {
  let playerSim = test.spawnSimulatedPlayer(new BlockLocation(1, 2, 0), "playerSim_border_break");
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(1, 4, 1));
  test.setBlockType(MinecraftBlockTypes.wool, new BlockLocation(1, 2, 1));
  const testEx = new GameTestExtensions(test);

  testEx.giveItem(playerSim, MinecraftItemTypes.shears, 1, 0);
  await test.idle(toTicks(1.0));
  playerSim.breakBlock(new BlockLocation(1, 2, 1));

  await test.idle(toTicks(1.0));
  playerSim.stopBreakingBlock();

  test.assertBlockPresent(MinecraftBlockTypes.wool, new BlockLocation(1, 2, 1), true);
  test.succeed();
})
  .structureName("BlockTests:border_blocks")
  .tag("suite:border")
  .tag("suite:edu");

GameTest.registerAsync("BlockTests", "player_border_block_move_below", async (test) => {
  let playerSim = test.spawnSimulatedPlayer(new BlockLocation(1, 2, 0), "playerSim_border_move_below");
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(1, 4, 1));
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(0, 4, 0));
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(2, 4, 0));
  const testEx = new GameTestExtensions(test);

  await test.idle(toTicks(0.5));
  playerSim.moveToLocation(new Location(1, 2, 1));

  await test.idle(toTicks(1.0));

  const loc = test.worldBlockLocation(new BlockLocation(1, 2, 0));
  const pLoc = GameTestExtensions.toBlockLocation(playerSim.location);
  test.assert(loc.equals(pLoc), `Player should not move through border: ${locactionToString(loc)} != ${locactionToString(pLoc)}`);

  test.succeed();
})
  .structureName("BlockTests:border_blocks")
  .tag("suite:border")
  .tag("suite:edu");

GameTest.registerAsync("BlockTests", "player_border_block_move_above", async (test) => {
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(1, 4, 1));
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(0, 4, 0));
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(2, 4, 0));
  test.setBlockType(MinecraftBlockTypes.stone, new BlockLocation(1, 5, 0));
  let playerSim = test.spawnSimulatedPlayer(new BlockLocation(1, 6, 0), "playerSim_border_move_above");
  const testEx = new GameTestExtensions(test);

  await test.idle(toTicks(0.5));
  playerSim.moveToLocation(new Location(1, 6, 1));

  await test.idle(toTicks(1.0));
  const loc = test.worldBlockLocation(new BlockLocation(1, 6, 0));
  const pLoc = GameTestExtensions.toBlockLocation(playerSim.location);
  test.assert(loc.equals(pLoc), `Player should not move through border: ${locactionToString(loc)} != ${locactionToString(pLoc)}`);

  test.succeed();
})
  .structureName("BlockTests:border_blocks")
  .tag("suite:border")
  .tag("suite:edu");

GameTest.registerAsync("BlockTests", "player_border_block_move_above_build_height", async (test) => {
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(1, 4, 1));
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(0, 4, 0));
  test.setBlockType(MinecraftBlockTypes.borderBlock, new BlockLocation(2, 4, 0));
  test.setBlockType(MinecraftBlockTypes.stone, new BlockLocation(1, 320, 0));
  let playerSim = test.spawnSimulatedPlayer(new BlockLocation(1, 321, 0), "playerSim_border_move_above");
  const testEx = new GameTestExtensions(test);

  await test.idle(toTicks(0.5));
  playerSim.moveToLocation(new Location(1, 6, 1));

  await test.idle(toTicks(1.0));
  const loc = test.worldBlockLocation(new BlockLocation(1, 321, 0));
  const pLoc = GameTestExtensions.toBlockLocation(playerSim.location);
  test.assert(loc.equals(pLoc), `Player should not move through border: ${locactionToString(loc)} != ${locactionToString(pLoc)}`);

  await test.idle(toTicks(0.5));
  test.destroyBlock(new BlockLocation(1, 320, 0));

  test.succeed();
})
  .structureName("BlockTests:border_blocks")
  .tag("suite:border")
  .tag("suite:edu");
