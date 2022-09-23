import { BlockLocation, Location, ItemStack } from "mojang-minecraft";

export default class GameTestExtensions {
  constructor(test) {
    this.test = test;
  }

  assertBlockProperty(propertyName, value, blockLocation) {
    this.test.assertBlockState(blockLocation, (block) => {
      return block.permutation.getProperty(propertyName).value == value;
    });
  }

  static toBlockLocation = (pos) => {
    return new BlockLocation(Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
  };

  static toLocation = (pos) => {
    return new Location(pos.x, pos.y, pos.z);
  };

  giveItem(player, itemType, amount, slot) {
    const inventoryContainer = player.getComponent("inventory").container;
    inventoryContainer.addItem(new ItemStack(itemType, amount ?? 1));
    player.selectedSlot = slot ?? 0;
  }
}
