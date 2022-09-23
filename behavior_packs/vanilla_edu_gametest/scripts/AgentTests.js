import {
  BlockLocation,
  BlockType,
  Direction,
  IEntityComponent,
  ItemType,
  ItemStack,
  Location,
  MinecraftBlockTypes,
  MinecraftItemTypes,
} from "mojang-minecraft";
import { Test } from "mojang-gametest";
import * as GameTest from "mojang-gametest";
import { Agent, GameTestAgentExtensions } from "./GameTestAgentExtensions.js";
import GameTestExtensions from "./GameTestExtensions.js";

class HealthComponent extends IEntityComponent {
  /** @type {number} */
  current = 0;

  /** @type {number} */
  value = 0;
}

class AttackTestOptions {
  /**
   * @type {Direction}
   */
  dir = Direction.north;
  /**
   * @type {BlockLocation}
   */
  entityOffset = new BlockLocation(0, 0, 1);
}

class CollectTestItem {
  /**
   *
   * @param {Location} offset
   * @param {ItemType} item
   * @param {number} count
   * @param {bool} stillPresentAfterCollect
   */
  constructor(offset, item, count, stillPresentAfterCollect) {
    /** @type {Location} */
    this.posOffset = offset || new Location(0.0, 0.0, 0.0);
    /** @type {ItemType} */
    this.item = item || new ItemType();
    /** @type {number} */
    this.count = count || 0;
    /** @type {bool} */
    this.stillPresentAfterCollect = stillPresentAfterCollect || false;
  }
}

class CollectTestOptions {
  /**
   *
   * @param {BlockLocation} origin
   * @param {BlockLocation} lookAtOffset
   * @param {string} spec
   * @param {CollectTestItem[]} items
   */
  constructor(origin, lookAtOffset, spec, items) {
    /** @type {BlockLocation} */
    this.origin = origin;
    /** @type {BlockLocation} */
    this.lookAtOffset = lookAtOffset;
    /** @type {string} */
    this.spec = spec;
    /** @type {CollectTestItem[]} */
    this.items = items;
  }
}

class DestroyTestOptions {
  /**
   *
   * @param {Direction} dir
   * @param {BlockType} block
   */
  constructor(dir, block) {
    /** @type {Direction} */
    this.dir = dir || Direction.north;

    /** @type {BlockLocation} */
    this.posOffset = GameTestAgentExtensions.directionToLocationOffset(this.dir);

    /** @type {BlockType} */
    this.block = block || null;
  }
}

class DropAllTestItem {
  /**
   *
   * @param {Direction} dir
   * @param {ItemType} item
   * @param {number} slot
   * @param {number} quantity
   */
  constructor(dir, item, slot, quantity) {
    /** @type {Location} */
    this.posOffset = GameTestAgentExtensions.directionToLocationOffset(dir);
    /** @type {ItemType} */
    this.item = item || null;
    /** @type {number} */
    this.slot = slot || 0;
    /** @type {number} */
    this.quantity = quantity || 0;
  }
}

class DropTestItem extends DropAllTestItem {
  /**
   *
   * @param {Direction} dir
   * @param {ItemType} item
   * @param {number} slot
   * @param {number} quantity
   */
  constructor(dir, item, slot, quantity) {
    super(dir, item, slot, quantity);
    /** @type {Direction} */
    this.dir = dir;
  }
}

class DropAllTestOptions {
  /**
   *
   * @param {BlockLocation} origin
   * @param {BlockLocation} lookAtOffset
   * @param {DropAllTestItem[]} items
   * @param {Direction} dir
   */
   constructor(origin, lookAtOffset, items, dir) {
    /** @type {BlockLocation} */
    this.origin = origin;
    /** @type {BlockLocation} */
    this.lookAtOffset = lookAtOffset;
    /** @type {DropAllTestItem[]} */
    this.items = items;
    /** @type {Direction} */
    this.dir = dir;
  }
}

class DropTestOptions {
  /** @type {DropTestItem[]} */
  items = [];
}

class InteractTestItem {
  /**
   *
   * @param {Direction} dir
   * @param {BlockLocation} posOffset
   * @param {boolean} usesRedstone
   * @param {number} redstonePower
   */
  constructor(dir, posOffset, usesRedstone, redstonePower) {
    this.dir = dir;
    this.posOffset = posOffset;
    this.usesRedstone = usesRedstone;
    this.redstonePower = redstonePower || 15;
  }
}

class InteractOptions {
  /**
   *
   * @param {BlockLocation} origin
   * @param {InteractTestItem[]} items
   */
  constructor(origin, items) {
    /** @type {InteractTestItem[]} */
    this.origin = origin || new BlockLocation(0, 0, 0);
    /** @type {InteractTestItem[]} */
    this.items = items || [];
  }
}

class MoveTestItems {
  /**
   *
   * @param {Direction} dir
   * @param {BlockLocation} expectedLocation
   */
  constructor(dir, expectedLocation) {
    /** @type {Direction} */
    this.dir = dir;
    /** @type {BlockLocation} */
    this.expectedLocation = expectedLocation;
  }
}

class MoveTestOptions {
  /**
   *
   * @param {BlockLocation} origin
   * @param {BlockLocation} lookAtOffset
   * @param {MoveTestItems[]} items
   */
  constructor(origin, lookAtOffset, items) {
    /** @type {BlockLocation} */
    this.origin = origin;
    /** @type {BlockLocation} */
    this.lookAtOffset = lookAtOffset;
    /** @type {MoveTestItems[]} */
    this.items = items;
  }
}

class PlaceTestItem {
  /**
   *
   * @param {string} blockName
   * @param {string} blockKey
   * @param {number} slot
   * @param {numebr} quantity
   * @param {Direction} dir
   * @param {BlockLocation} expectedLocation
   */
  constructor(blockName, blockKey, slot, quantity, dir, expectedLocation) {
    /** @type {number} */
    this.slot = slot || 0;
    /** @type {number} */
    this.quantity = quantity || 0;
    /** @type {BlockLocation} */
    this.expectedLocation = expectedLocation || new BlockLocation(0, 0, 0);
    /** @type {Direction} */
    this.dir = dir;
    /** @type {string} */
    this.blockName = blockName || "";
    /** @type {BlockType} */
    this.block = MinecraftBlockTypes[blockKey];
    /** @type {ItemType} */
    this.item = MinecraftItemTypes[blockKey];
  }
}

class PlaceTestOptions {
  /**
   *
   * @param {BlockLocation} origin
   * @param {BlockLocation} lookAtOffset
   * @param {PlaceTestItem[]} items
   */
  constructor(origin, lookAtOffset, items) {
    /** @type {BlockLocation} */
    this.origin = origin;
    /** @type {BlockLocation} */
    this.lookAtOffset = lookAtOffset;
    /** @type {PlaceTestItem[]} */
    this.items = items;
  }
}

class AttackTester {
  /**
   *
   * @param {AttackTestOptions[]} tests
   */
  constructor(tests) {
    /** @type {AttackTestOptions[]} */
    this.tests = tests;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 15 + this.tests.length * 30;
  }

  /**
   *
   * @param {Test} test
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {AttackTestOptions} options
   */
  runTest = async (test, agent, origin, options) => {
    const spawnLoc = origin.offset(options.entityOffset.x, options.entityOffset.y, options.entityOffset.z);
    const cow = test.spawn("minecraft:cow<minecraft:ageable_grow_up>", spawnLoc);

    /** @type {HealthComponent} */
    const health = cow.getComponent("health");
    test.assert(health.current == health.value, "Health should be full before attacking");

    agent.attack(options.dir);
    await test.idle(5);

    test.assert(health.current < health.value, "Health should not be full after attacking");
    cow.kill();
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const testOrigin = new BlockLocation(3, 2, 3);
    const testOriginLookOffset = new BlockLocation(0, 0, 1);
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, testOrigin, testOriginLookOffset);

    for (let testItem of this.tests) {
      await this.runTest(test, agent, testOrigin, testItem);
    }

    agent.kill();

    test.succeed();
  };
}

class CollectTester {
  /**
   *
   * @param {CollectTestOptions} tests
   */
  constructor(testsOptions) {
    /** @type {CollectTestOptions} */
    this.options = testsOptions;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 15 + this.options.items.length * 10;
  }

  /**
   *
   * @param {Test} test
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {CollectTestOptions} options
   */
  runTest = async (test, agent, origin, options) => {
    const itemEntityId = "minecraft:item";
    let originLoc = new Location(origin.x, origin.y, origin.z);
    for (let item of options.items) {
      let itemLoc = new Location(
        originLoc.x + item.posOffset.x + 0.5,
        originLoc.y + item.posOffset.y,
        originLoc.z + item.posOffset.z + 0.5
      );
      test.spawnItem(new ItemStack(item.item, item.count), itemLoc);
    }
    await test.idle(2);

    agent.collect(options.spec);
    await test.idle(5);

    for (let item of options.items) {
      let itemLoc = origin.offset(item.posOffset.x, item.posOffset.y, item.posOffset.z);
      test.assertEntityPresent(itemEntityId, itemLoc, item.stillPresentAfterCollect);
    }
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const testOrigin = this.options.origin;
    const testOriginLookOffset = this.options.lookAtOffset;
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, testOrigin, testOriginLookOffset);

    await this.runTest(test, agent, testOrigin, this.options);

    agent.kill();

    test.succeed();
  };
}

class DestroyTester {
  /**
   *
   * @param {DestroyTestOptions} tests
   */
  constructor(tests) {
    /** @type {DestroyTestOptions} */
    this.tests = tests;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 15 + this.tests.length * 12;
  }

  /**
   *
   * @param {Test} test
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {DestroyTestOptions} options
   */
  runTest = async (test, agent, origin, options) => {
    const blockLoc = origin.offset(options.posOffset.x, options.posOffset.y, options.posOffset.z);
    test.setBlockType(options.block, blockLoc);
    await test.idle(1);

    agent.destroy(options.dir);
    await test.idle(5);

    test.assertBlockPresent(options.block, blockLoc, false);
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const testOrigin = new BlockLocation(1, 2, 1);
    const testOriginLookOffset = new BlockLocation(0, 0, 1);
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, testOrigin, testOriginLookOffset);

    for (let testItem of this.tests) {
      await this.runTest(test, agent, testOrigin, testItem);
    }

    agent.kill();

    test.succeed();
  };
}

class DropAllTester {
  /**
   *
   * @param {DropAllTestOptions} testsOptions
   */
  constructor(testsOptions) {
    /** @type {DropAllTestOptions} */
    this.options = testsOptions;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 15 + this.options.items.length * 10;
  }

  /**
   *
   * @param {Test} test
   * @param {GameTestAgentExtensions} testEx
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {DropAllTestOptions} options
   */
  runTest = async (test, testEx, agent, origin, options) => {
    const itemEntityId = "minecraft:item";
    for (let item of options.items) {
      let itemLoc = origin.offset(item.posOffset.x, item.posOffset.y, item.posOffset.z);
      test.assertEntityPresent(itemEntityId, itemLoc, false);

      const stack = new ItemStack(item.item, item.quantity);
      agent.container().setItem(item.slot, stack);
    }
    await test.idle(2);

    agent.dropAll(options.dir);
    await test.idle(5);

    let dirOffset = GameTestAgentExtensions.directionToLocationOffset(options.dir);
    let dropAllLocation = origin.offset(dirOffset.x, dirOffset.y, dirOffset.z);
    await testEx.teleportItems(test.worldBlockLocation(dropAllLocation));
    await test.idle(5);

    for (let item of options.items) {
      const slotItem = agent.container().getItem(item.slot);
      test.assert(!slotItem || slotItem.amount === 0, "Should have dropped all items in slot");
      let itemLoc = origin.offset(item.posOffset.x, item.posOffset.y, item.posOffset.z);
      test.assertEntityPresent(itemEntityId, itemLoc, true);
    }
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, this.options.origin, this.options.lookAtOffset);

    await this.runTest(test, agent._testEx, agent, this.options.origin, this.options);

    agent.kill();

    test.succeed();
  };
}

class DropTester {
  /**
   *
   * @param {DropTestOptions} testsOptions
   */
  constructor(testsOptions) {
    /** @type {DropTestOptions} */
    this.options = testsOptions;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 15 + this.options.items.length * 10;
  }

  /**
   *
   * @param {Test} test
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {DropTestOptions} options
   */
  runTest = async (test, agent, origin, options) => {
    const itemEntityId = "minecraft:item";
    for (let item of options.items) {
      let itemLoc = origin.offset(item.posOffset.x, item.posOffset.y, item.posOffset.z);
      test.assertEntityPresent(itemEntityId, itemLoc, false);

      const stack = new ItemStack(item.item, item.quantity);
      agent.container().setItem(item.slot, stack);

      await test.idle(3);

      agent.drop(item.slot + 1, item.quantity, item.dir);
      await test.idle(6);

      const slotItem = agent.container().getItem(item.slot);
      test.assert(!slotItem || slotItem.amount === 0, "Should have dropped all items in slot");

      test.assertEntityPresent(itemEntityId, itemLoc, true);
    }
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const testOrigin = new BlockLocation(1, 2, 1);
    const testOriginLookOffset = new BlockLocation(0, 0, 1);
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, testOrigin, testOriginLookOffset);

    await this.runTest(test, agent, testOrigin, this.options);

    agent.kill();

    test.succeed();
  };
}

class InteractTester {
  /**
   *
   * @param {DropTestOptions} testsOptions
   */
  constructor(testsOptions) {
    /** @type {DropTestOptions} */
    this.options = testsOptions;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 15 + this.options.items.length * 10;
  }

  /**
   *
   * @param {Test} test
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {DropTestOptions} options
   */
  runTest = async (test, agent, origin, options) => {
    const testEx = new GameTestExtensions(test);
    const openBitProperty = "open_bit";

    for (let item of options.items) {
      let outputPos = item.posOffset;
      if (item.usesRedstone) {
        test.assertRedstonePower(outputPos, 0);
      } else {
        testEx.assertBlockProperty(openBitProperty, false, outputPos);
      }
    }

    for (let item of options.items) {
      agent.interact(item.dir);
      await test.idle(3);
    }
    await test.idle(10);

    for (let item of options.items) {
      let outputPos = item.posOffset;
      if (item.usesRedstone) {
        test.assertRedstonePower(outputPos, item.redstonePower);
      } else {
        testEx.assertBlockProperty(openBitProperty, true, outputPos);
      }
    }
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const testOrigin = this.options.origin;
    const testOriginLookOffset = new BlockLocation(0, 0, 1);
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, testOrigin, testOriginLookOffset);

    await this.runTest(test, agent, testOrigin, this.options);

    agent.kill();

    test.succeed();
  };
}

class MoveTester {
  /**
   *
   * @param {MoveTestOptions} testsOptions
   */
  constructor(testsOptions) {
    /** @type {MoveTestOptions} */
    this.options = testsOptions;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 25 + this.options.items.length * 10;
  }

  /**
   *
   * @param {Test} test
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {MoveTestOptions} options
   */
  runTest = async (test, agent, origin, options) => {
    let currentPos = origin;
    let agentLoc = agent.blockLocation();
    test.assert(currentPos.equals(agentLoc), "Agent isn't at origin");
    for (let item of options.items) {
      agent.move(item.dir);
      await test.idle(7);
      currentPos = currentPos.offset(item.expectedLocation.x, item.expectedLocation.y, item.expectedLocation.z);
      agentLoc = agent.blockLocation();
      test.assert(
        currentPos.equals(agentLoc),
        `Agent isn't at expected location: <${currentPos.x}, ${currentPos.y}, ${currentPos.z}>`
      );
    }
    await test.idle(7);
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const testOrigin = this.options.origin;
    const testOriginLookOffset = this.options.lookAtOffset;
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, testOrigin, testOriginLookOffset);

    await this.runTest(test, agent, testOrigin, this.options);

    agent.kill();

    test.succeed();
  };
}

class PlaceTester {
  /**
   *
   * @param {PlaceTestOptions} testsOptions
   */
  constructor(testsOptions) {
    /** @type {PlaceTestOptions} */
    this.options = testsOptions;
    /** @type {string} */
    this.batchId = GameTestAgentExtensions.generateGuid();
    /** @type {number} */
    this.maxTicks = 25 + this.options.items.length * 5;
  }

  /**
   *
   * @param {Test} test
   * @param {Agent} agent
   * @param {BlockLocation} origin
   * @param {PlaceTestOptions} options
   */
  runTest = async (test, agent, origin, options) => {
    for (let item of options.items) {
      const stack = new ItemStack(item.item, item.quantity);
      const container = agent.container();
      container.setItem(item.slot, stack);
    }

    for (let item of options.items) {
      const pos = origin.offset(item.expectedLocation.x, item.expectedLocation.y, item.expectedLocation.z);
      test.assertBlockPresent(item.block, pos, false);

      agent.place(item.slot + 1, item.dir);
      await test.idle(3);

      test.assertBlockPresent(item.block, pos, true);
    }

    await test.idle(7);
  };

  /**
   *
   * @param {Test} test
   */
  test = async (test) => {
    const testOrigin = this.options.origin;
    const testOriginLookOffset = this.options.lookAtOffset;
    const player = test.spawnSimulatedPlayer(new BlockLocation(0, 0, -1), "Sim Player");
    const agent = await Agent.createAgent(test, player, testOrigin, testOriginLookOffset);

    await this.runTest(test, agent, testOrigin, this.options);

    agent.kill();

    test.succeed();
  };
}

// Attack tests
{
  /** @type {AttackTestOptions[]} */
  const attackOptions = [
    {
      dir: Direction.north,
      entityOffset: new BlockLocation(0, 0, 1),
    },
    {
      dir: Direction.east,
      entityOffset: new BlockLocation(-1, 0, 0),
    },
    {
      dir: Direction.south,
      entityOffset: new BlockLocation(0, 0, -1),
    },
    {
      dir: Direction.west,
      entityOffset: new BlockLocation(1, 0, 0),
    },
  ];
  const tester = new AttackTester(attackOptions);

  GameTest.registerAsync("agent_test", "attack", async (test) => await tester.test(test))
    .batch(tester.batchId)
    .tag(GameTest.Tags.suiteDefault)
    .tag("suite:edu")
    .maxTicks(tester.maxTicks);
}

// Collect tests
{
  // Collect specific test
  {
    const items = [];
    items.push(new CollectTestItem(new Location(0, 0, 1), MinecraftItemTypes.netheriteHelmet, 1, true));
    items.push(new CollectTestItem(new Location(-1, 0, 0), MinecraftItemTypes.apple, 2, false));

    let origin = new BlockLocation(1, 2, 1);
    const originLookOffset = new BlockLocation(0, 0, 1);
    /** @type {CollectTestOptions} */
    const options = new CollectTestOptions(origin, originLookOffset, "apple", items);
    const tester = new CollectTester(options);

    GameTest.registerAsync("agent_test", "collect_apple", async (test) => await tester.test(test))
      .structureName("agent_test:collect")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }

  // Collect all test
  {
    const items = [];
    items.push(new CollectTestItem(new Location(0, 0, 1), MinecraftItemTypes.netheriteHelmet, 1, false));
    items.push(new CollectTestItem(new Location(-1, 0, 0), MinecraftItemTypes.apple, 2, false));

    let origin = new BlockLocation(1, 2, 1);
    const originLookOffset = new BlockLocation(0, 0, 1);
    /** @type {CollectTestOptions} */
    const options = new CollectTestOptions(origin, originLookOffset, "all", items);
    const tester = new CollectTester(options);

    GameTest.registerAsync("agent_test", "collect_all", async (test) => await tester.test(test))
      .structureName("agent_test:collect")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }
}

// Destroy Block tests
{
  // Destroy Blocks test
  {
    /** @type {DestroyTestOptions[]} */
    const targets = [];
    targets.push(new DestroyTestOptions(Direction.north, MinecraftBlockTypes.stone));
    targets.push(new DestroyTestOptions(Direction.east, MinecraftBlockTypes.grass));
    targets.push(new DestroyTestOptions(Direction.south, MinecraftBlockTypes.goldBlock));
    targets.push(new DestroyTestOptions(Direction.west, MinecraftBlockTypes.diamondBlock));
    const tester = new DestroyTester(targets);

    GameTest.registerAsync("agent_test", "destroy_blocks", async (test) => await tester.test(test))
      .structureName("agent_test:destroy")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }

  // Destroy Block Objects test
  {
    /** @type {DestroyTestOptions[]} */
    const targets = [];
    targets.push(new DestroyTestOptions(Direction.north, MinecraftBlockTypes.bed));
    targets.push(new DestroyTestOptions(Direction.east, MinecraftBlockTypes.lectern));
    targets.push(new DestroyTestOptions(Direction.south, MinecraftBlockTypes.lever));
    targets.push(new DestroyTestOptions(Direction.west, MinecraftBlockTypes.lantern));
    const tester = new DestroyTester(targets);

    GameTest.registerAsync("agent_test", "destroy_block_items", async (test) => await tester.test(test))
      .structureName("agent_test:destroy")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }
}

// DropAll Items tests
{
  let origin = new BlockLocation(2, 2, 2);
  const originLookOffset = new BlockLocation(0, 0, 1);
  // DropAll Items (Block) test
  {
    const dir = Direction.north;
    const items = [];
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.stone, 0, 32));
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.grass, 1, 16));
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.goldBlock, 2, 8));
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.diamondBlock, 3, 4));

    const options = new DropAllTestOptions(origin, originLookOffset, items, dir);
    const tester = new DropAllTester(options);

    GameTest.registerAsync("agent_test", "drop_all_blocks", async (test) => await tester.test(test))
      .structureName("agent_test:drop")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      // Still working on details for this one so it can be consistant
      // There is an issue where the items are pushed in to a new space which would fail the test.
      .tag(GameTest.Tags.suiteDisabled)
      .requiredSuccessfulAttempts(1)
      .maxTicks(tester.maxTicks);
  }

  // DropAll Items (Block Objects) test
  {
    const dir = Direction.north;
    const items = [];
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.bed, 0, 1));
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.lectern, 1, 1));
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.lever, 2, 8));
    items.push(new DropAllTestItem(dir, MinecraftItemTypes.lantern, 3, 4));

    const options = new DropAllTestOptions(origin, originLookOffset, items, dir);
    const tester = new DropAllTester(options);

    GameTest.registerAsync("agent_test", "drop_all_block_items", async (test) => await tester.test(test))
      .structureName("agent_test:drop")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }
}

// Drop Item tests
{
  // Drop Item (Block) test
  {
    const items = [];
    items.push(new DropTestItem(Direction.north, MinecraftItemTypes.stone, 0, 32));
    items.push(new DropTestItem(Direction.east, MinecraftItemTypes.grass, 1, 16));
    items.push(new DropTestItem(Direction.south, MinecraftItemTypes.goldBlock, 2, 8));
    items.push(new DropTestItem(Direction.west, MinecraftItemTypes.diamondBlock, 3, 4));

    const options = new DropTestOptions();
    options.items = items;
    const tester = new DropTester(options);

    GameTest.registerAsync("agent_test", "drop_blocks", async (test) => await tester.test(test))
      .structureName("agent_test:drop")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }

  // Drop Item (Block Object) test
  {
    const items = [];
    items.push(new DropTestItem(Direction.north, MinecraftItemTypes.bed, 0, 1));
    items.push(new DropTestItem(Direction.east, MinecraftItemTypes.lectern, 1, 1));
    items.push(new DropTestItem(Direction.south, MinecraftItemTypes.lever, 2, 8));
    items.push(new DropTestItem(Direction.west, MinecraftItemTypes.lantern, 3, 4));

    const options = new DropTestOptions();
    options.items = items;
    const tester = new DropTester(options);

    GameTest.registerAsync("agent_test", "drop_block_items", async (test) => await tester.test(test))
      .structureName("agent_test:drop")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }
}

// Interact tests
{
  // Interact (Switches) test
  {
    const items = [];
    items.push(new InteractTestItem(Direction.north, new BlockLocation(0, 2, 0), true, 13));
    items.push(new InteractTestItem(Direction.east, new BlockLocation(2, 2, 0), true, 15));
    items.push(new InteractTestItem(Direction.south, new BlockLocation(4, 2, 0), true, 15));
    items.push(new InteractTestItem(Direction.up, new BlockLocation(6, 2, 0), true, 15));

    const options = new InteractOptions(new BlockLocation(3, 3, 5), items);
    const tester = new InteractTester(options);

    GameTest.registerAsync("agent_test", "interact_switches", async (test) => await tester.test(test))
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }

  // Interact (Trapdoors) test
  {
    const origin = new BlockLocation(2, 3, 2);
    const offsetOrigin = (x, y, z) => {
      return origin.offset(x, y, z);
    };

    const items = [];
    items.push(new InteractTestItem(Direction.north, offsetOrigin(0, 0, 1), false));
    items.push(new InteractTestItem(Direction.east, offsetOrigin(-1, 0, 0), false));
    items.push(new InteractTestItem(Direction.south, offsetOrigin(0, 0, -1), false));
    items.push(new InteractTestItem(Direction.west, offsetOrigin(1, 0, 0), false));
    items.push(new InteractTestItem(Direction.up, offsetOrigin(0, 1, 0), false));
    items.push(new InteractTestItem(Direction.down, offsetOrigin(0, -1, 0), false));

    const options = new InteractOptions(origin, items);
    const tester = new InteractTester(options);

    GameTest.registerAsync("agent_test", "interact_trapdoors", async (test) => await tester.test(test))
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }

  // Interact (Doors) test
  {
    const origin = new BlockLocation(2, 4, 2);
    const offsetOrigin = (x, y, z) => {
      return origin.offset(x, y, z);
    };

    const items = [];
    items.push(new InteractTestItem(Direction.north, offsetOrigin(0, 0, 1), false));
    items.push(new InteractTestItem(Direction.east, offsetOrigin(-1, 0, 0), false));
    items.push(new InteractTestItem(Direction.south, offsetOrigin(0, 0, -1), false));
    items.push(new InteractTestItem(Direction.west, offsetOrigin(1, 0, 0), false));
    items.push(new InteractTestItem(Direction.down, offsetOrigin(0, -2, 0), false));

    const options = new InteractOptions(origin, items);
    const tester = new InteractTester(options);

    GameTest.registerAsync("agent_test", "interact_doors", async (test) => await tester.test(test))
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }
}

// Move tests
{
  // Move (No blocked moves) test
  {
    const items = [];
    items.push(new MoveTestItems(Direction.up, new BlockLocation(0, 1, 0)));
    items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 1)));
    items.push(new MoveTestItems(Direction.east, new BlockLocation(-1, 0, 0)));
    items.push(new MoveTestItems(Direction.south, new BlockLocation(0, 0, -1)));
    items.push(new MoveTestItems(Direction.west, new BlockLocation(1, 0, 0)));
    items.push(new MoveTestItems(Direction.down, new BlockLocation(0, -1, 0)));

    let origin = new BlockLocation(1, 2, 0);
    const originLookOffset = new BlockLocation(0, 0, 1);
    const options = new MoveTestOptions(origin, originLookOffset, items);
    const tester = new MoveTester(options);

    GameTest.registerAsync("agent_test", "move_no_obstacles", async (test) => await tester.test(test))
      .structureName("agent_test:move")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);

    origin = new BlockLocation(5, 2, 2);
    const carpet_options = new MoveTestOptions(origin, originLookOffset, items);
    const carpet_tester = new MoveTester(carpet_options);

    GameTest.registerAsync("agent_test", "move_carpet", async (test) => await carpet_tester.test(test))
      .structureName("agent_test:move")
      .batch(carpet_tester.batchId)
      .maxTicks(carpet_tester.maxTicks)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }

  // Move (blocked moves) test
  {
    const items = [];
    items.push(new MoveTestItems(Direction.up, new BlockLocation(0, 0, 0)));
    items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 1)));
    items.push(new MoveTestItems(Direction.east, new BlockLocation(-1, 0, 0)));
    items.push(new MoveTestItems(Direction.south, new BlockLocation(0, 0, -1)));
    items.push(new MoveTestItems(Direction.west, new BlockLocation(1, 0, 0)));
    items.push(new MoveTestItems(Direction.down, new BlockLocation(0, 0, 0)));

    let origin = new BlockLocation(1, 2, 5);
    const originLookOffset = new BlockLocation(0, 0, 1);
    {
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_capped", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }

    origin = new BlockLocation(5, 2, 0);
    {
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);
      GameTest.registerAsync("agent_test", "move_carpet_capped", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }

    origin = new BlockLocation(5, 2, 1);
    {
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);
      GameTest.registerAsync("agent_test", "move_carpet_capped_mixed", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }
  }

  // Move (Transition carpet / no carpet)
  {
    // Capped
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(1, 0, 0)));

      let origin = new BlockLocation(3, 2, 0);
      const originLookOffset = new BlockLocation(1, 0, 0);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_carpet_transition_capped", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }

    // Uncapped
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(1, 0, 0)));

      let origin = new BlockLocation(3, 2, 1);
      const originLookOffset = new BlockLocation(1, 0, 0);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_carpet_transition_uncapped", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }
  }

  // Move (Trapdoor) test
  {
    // Uncapped trapdoor on floor
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 1)));
      items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 1)));

      let origin = new BlockLocation(2, 2, 2);
      const originLookOffset = new BlockLocation(0, 0, 1);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_trapdoor_uncapped", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }

    // Capped trapdoor on floor blocked
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 0)));

      let origin = new BlockLocation(1, 2, 2);
      const originLookOffset = new BlockLocation(0, 0, 1);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_trapdoor_capped_blocked", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }

    // Capped trapdoor on ceiling blocked
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 0)));

      let origin = new BlockLocation(0, 2, 2);
      const originLookOffset = new BlockLocation(0, 0, 1);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_trapdoor_ceiling_blocked", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }

    // Trapdoor (closed) on ceiling 1 block upwards blocked
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 0)));

      let origin = new BlockLocation(0, 2, 2);
      const originLookOffset = new BlockLocation(0, 0, 1);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync(
        "agent_test",
        "move_trapdoor_ceiling_upward_closed",
        async (test) => await tester.test(test)
      )
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }

    // Trapdoor (open) on ceiling 1 block upwards unblocked
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 1, 0)));

      let origin = new BlockLocation(1, 2, 2);
      const originLookOffset = new BlockLocation(0, 0, 1);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_trapdoor_ceiling_upward_open", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        // .tag(GameTest.Tags.suiteDefault)
        // .tag("suite:edu")
        // This should work, but there need to be further improvements to the collision logic
        // To accomidate a space where a trapdoor is on a wall and open
        .tag(GameTest.Tags.suiteDisabled)
        .maxTicks(tester.maxTicks);
    }

    // Trapdoor (closed) on as floor 1 block unblocked
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(-1, 0, 0)));

      let origin = new BlockLocation(1, 2, 4);
      const originLookOffset = new BlockLocation(-1, 0, 0);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_trapdoor_floor_closed", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        .tag(GameTest.Tags.suiteDefault)
        .tag("suite:edu")
        .maxTicks(tester.maxTicks);
    }
  }

  // Move (Door) test
  {
    // Door (open) unblocked
    {
      const items = [];
      items.push(new MoveTestItems(Direction.north, new BlockLocation(0, 0, 1)));
      items.push(new MoveTestItems(Direction.east, new BlockLocation(-1, 0, 0)));
      items.push(new MoveTestItems(Direction.south, new BlockLocation(0, 0, -1)));
      items.push(new MoveTestItems(Direction.west, new BlockLocation(1, 0, 0)));

      let origin = new BlockLocation(5, 4, 0);
      const originLookOffset = new BlockLocation(0, 0, 1);
      const options = new MoveTestOptions(origin, originLookOffset, items);
      const tester = new MoveTester(options);

      GameTest.registerAsync("agent_test", "move_door_open", async (test) => await tester.test(test))
        .structureName("agent_test:move")
        .batch(tester.batchId)
        // .tag(GameTest.Tags.suiteDefault)
        // .tag("suite:edu")
        // This should work, but there need to be further improvements to the collision logic
        // To accomidate a space where a door behind the agent
        .tag(GameTest.Tags.suiteDisabled)
        .maxTicks(tester.maxTicks);
    }
  }
}

{
  // Place (Blocks) test
  {
    const items = [];
    items.push(new PlaceTestItem("stone", "stone", 0, 1, Direction.north, new BlockLocation(0, 0, 1)));
    items.push(new PlaceTestItem("grass", "grass", 1, 1, Direction.east, new BlockLocation(-1, 0, 0)));
    items.push(new PlaceTestItem("gold_block", "goldBlock", 2, 1, Direction.south, new BlockLocation(0, 0, -1)));
    items.push(new PlaceTestItem("diamond_block", "diamondBlock", 3, 1, Direction.west, new BlockLocation(1, 0, 0)));

    let origin = new BlockLocation(2, 2, 2);
    const originLookOffset = new BlockLocation(0, 0, 1);
    const options = new PlaceTestOptions(origin, originLookOffset, items);
    const tester = new PlaceTester(options);

    GameTest.registerAsync("agent_test", "place_blocks", async (test) => await tester.test(test))
      .structureName("agent_test:place")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }

  // Place (in air) test
  {
    const items = [];
    items.push(new PlaceTestItem("stone", "stone", 0, 1, Direction.north, new BlockLocation(0, 0, 1)));
    items.push(new PlaceTestItem("grass", "grass", 1, 1, Direction.east, new BlockLocation(-1, 0, 0)));
    items.push(new PlaceTestItem("gold_block", "goldBlock", 2, 1, Direction.south, new BlockLocation(0, 0, -1)));
    items.push(new PlaceTestItem("diamond_block", "diamondBlock", 3, 1, Direction.west, new BlockLocation(1, 0, 0)));
    items.push(new PlaceTestItem("dirt", "dirt", 4, 1, Direction.down, new BlockLocation(0, -1, 0)));
    items.push(new PlaceTestItem("basalt", "basalt", 5, 1, Direction.up, new BlockLocation(0, 1, 0)));

    let origin = new BlockLocation(2, 3, 2);
    const originLookOffset = new BlockLocation(0, 0, 1);
    const options = new PlaceTestOptions(origin, originLookOffset, items);
    const tester = new PlaceTester(options);

    GameTest.registerAsync("agent_test", "place_blocks_in_air", async (test) => await tester.test(test))
      .structureName("agent_test:place")
      .batch(tester.batchId)
      .tag(GameTest.Tags.suiteDefault)
      .tag("suite:edu")
      .maxTicks(tester.maxTicks);
  }
}
