import { Block, BlockLocation, Direction, Entity, InventoryComponentContainer, Location } from "mojang-minecraft";
import { SimulatedPlayer, Test } from "mojang-gametest";

class GameTestAgentExtensions {
  /**
   *
   * @param {Test} test
   * @param {SimulatedPlayer} player
   */
  constructor(test, player) {
    this._test = test;
    this._player = player;
  }

  /**
   *
   * @param {string} command
   * @returns
   */
  agentCommand = (command) => {
    return this._player.runCommandAsync(`agent ${command}`);
  };

  _command = (command) => {
    return this._player.runCommandAsync(command);
  };

  /**
   *
   * @param {BlockLocation} itemPos
   * @param {number} searchRadius
   * @returns {*}
   */
  teleportItems = (itemPos, searchRadius = 5) => {
    let tpCommand = `tp @e[type=item,x=${itemPos.x},y=${itemPos.y},z=${itemPos.z},r=${searchRadius}] ${itemPos.x} ${itemPos.y} ${itemPos.z}`;
    return this._command(tpCommand);
  };

  /**
   *
   * @param {Direction} direction
   * @returns {"up" | "down" | "left" | "right" | "forward" | "back"}
   */
  static directionToAgentDir = (direction) => {
    switch (direction) {
      case Direction.up:
        return "up";
      case Direction.down:
        return "down";
      case Direction.north:
        return "forward";
      case Direction.south:
        return "back";
      case Direction.west:
        return "left";
      case Direction.east:
        return "right";
    }
    return "";
  };

  /**
   *
   * @param {BlockLocation} direction
   */
  static directionToLocationOffset = (direction) => {
    switch (direction) {
      case Direction.north:
        return new BlockLocation(0, 0, 1);
      case Direction.south:
        return new BlockLocation(0, 0, -1);
      case Direction.east:
        return new BlockLocation(-1, 0, 0);
      case Direction.west:
        return new BlockLocation(1, 0, 0);
      case Direction.up:
        return new BlockLocation(0, 1, 0);
      case Direction.down:
        return new BlockLocation(0, -1, 0);
      default:
        return new BlockLocation(0, 0, 0);
    }
  };

  static generateGuid = () => {
    return `${new Date().getTime().toString(16)}${Math.floor(1e7 * Math.random()).toString(16)}`;
  };
}

export default class Agent {
  constructor(test, player) {
    /** @type {Test} */
    this._test = test;
    /** @type {SimulatedPlayer} */
    this._player = player;
    /** @type {GameTestAgentExtensions} */
    this._testEx = new GameTestAgentExtensions(test, player);
    /** @type {Entity[]} */
    this.entities = null;
  }

  /**
   * @param {Direction} direction
   */
  attack = (direction) => {
    let dir = GameTestAgentExtensions.directionToAgentDir(direction);
    return this._testEx.agentCommand(`attack ${dir}`);
  };

  /**
   *
   * @returns {BlockLocation}
   */
  blockLocation = () => {
    let loc = this.entity().location;
    let blockPos = new BlockLocation(Math.floor(loc.x), Math.floor(loc.y), Math.floor(loc.z));
    return this._test.relativeBlockLocation(blockPos);
  };

  /**
   * @param {string|"all"} mode
   */
  collect = (mode) => {
    return this._testEx.agentCommand(`collect ${mode}`);
  };

  /**
   *
   * @returns {InventoryComponentContainer}
   */
  container = () => {
    return this.entity().getComponent("inventory").container;
  };

  /**
   * @param {Direction} direction
   */
  destroy = (direction) => {
    let dir = GameTestAgentExtensions.directionToAgentDir(direction);
    return this._testEx.agentCommand(`destroy ${dir}`);
  };

  destroySequence = (sequence, directions) => {
    for (let dir of directions) {
      sequence = sequence.thenWaitAfter(5, () => {
        this.destroy(dir);
      });
    }
    return sequence;
  };

  /**
   *
   * @returns {Entity}
   */
  entity = () => {
    return this._entity;
  };

  /**
   *
   * @param {number} slot
   * @param {number} quantity
   * @param {Direction} direction
   * @returns
   */
  drop = (slot, quantity, direction) => {
    let dir = GameTestAgentExtensions.directionToAgentDir(direction);
    return this._testEx.agentCommand(`drop ${slot} ${quantity} ${dir}`);
  };

  dropAll = (direction) => {
    let dir = GameTestAgentExtensions.directionToAgentDir(direction);
    return this._testEx.agentCommand(`dropall ${dir}`);
  };

  interact = (direction) => {
    let dir = GameTestAgentExtensions.directionToAgentDir(direction);
    return this._testEx.agentCommand(`interact ${dir}`);
  };

  interactSequence = (sequence, directions) => {
    for (let dir of directions) {
      sequence = sequence.thenWaitAfter(5, () => {
        this.interact(dir);
      });
    }
    return sequence;
  };

  kill = () => {
    this._entity.kill();
    this._entity = null;
  };

  /**
   *
   * @param {number} slot
   * @param {Direction} direction
   * @returns
   */
  place = (slot, direction) => {
    let dir = GameTestAgentExtensions.directionToAgentDir(direction);
    return this._testEx.agentCommand(`place ${slot} ${dir}`);
  };

  /**
   *
   * @returns {Location}
   */
  location = () => {
    return this._test.relativeLocation(this.entity().location);
  };

  /**
   *
   * @param {Direction} direction
   * @returns {*}
   */
  move = (direction) => {
    let dir = GameTestAgentExtensions.directionToAgentDir(direction);
    return this._testEx.agentCommand(`move ${dir}`);
  };

  moveSequence = (sequence, directions) => {
    for (let move of directions) {
      sequence = sequence.thenWaitAfter(8, () => {
        this.move(move);
      });
    }
    return sequence;
  };

  spawn = () => {
    return this._testEx.agentCommand("create");
  };

  /**
   *
   * @param {BlockLocation} loc
   * @param {BlockLocation} facing
   * @returns
   */
  tp = (loc, facing) => {
    let cmd = `tp ${loc.x} ${loc.y} ${loc.z}`;
    if (facing) {
      cmd = `${cmd} facing ${facing.x} ${facing.y} ${facing.z}`;
    }
    return this._testEx.agentCommand(cmd);
  };

  /**
   *
   * @param {Test} test
   * @param {SimulatedPlayer} player
   * @param {BlockLocation} loc
   * @param {BlockLocation} facing
   * @returns
   */
  static createAgent = async (test, player, loc, facing) => {
    const agent = new Agent(test, player);
    agent.spawn();
    await test.idle(5);

    const wLoc = test.worldBlockLocation(loc);
    const wStartLocLookAt = test.worldBlockLocation(loc.offset(facing.x, facing.y, facing.z));
    agent.tp(wLoc, wStartLocLookAt);

    await test.idle(5);
    agent._entity = test.getDimension().getEntitiesAtBlockLocation(wLoc)[0];
    return agent;
  };
}

export { Agent, GameTestAgentExtensions };
