import { BlockLocation, Location } from "mojang-minecraft";

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
    return new BlockLocation(pos.x, pos.y, pos.z);
  };

  static toLocation = (pos) => {
    return new Location(pos.x, pos.y, pos.z);
  };
}
