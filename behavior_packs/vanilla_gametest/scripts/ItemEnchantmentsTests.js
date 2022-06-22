import * as GameTest from "mojang-gametest";
import {
  BlockLocation,
  MinecraftBlockTypes,
  Direction,
  MinecraftItemTypes,
  ItemStack,
  Location,
  world,
  MinecraftEnchantmentTypes,
  Enchantment,
  EnchantmentSlot

} from "mojang-minecraft";


GameTest.register("ItemEnchantmentsTests", "item_get_enchantments_component", (test) => {
  const itemStack = new ItemStack(MinecraftItemTypes.ironSword);
  const enchantsComponent = itemStack.getComponent("minecraft:enchantments");

  test.assert(enchantsComponent != undefined, "Enchantments component should not be null");
  test.succeed();
})
.structureName("ComponentTests:platform")
.tag(GameTest.Tags.suiteDefault);

GameTest.register("ItemEnchantmentsTests", "item_can_have_enchantments_applied", (test) => {
  const itemStack = new ItemStack(MinecraftItemTypes.ironSword);
  const enchantsComponent = itemStack.getComponent("minecraft:enchantments");
  const enchantments = enchantsComponent.enchantments;

  let addSuccess = enchantments.addEnchantment(new Enchantment(MinecraftEnchantmentTypes.fireAspect, 2));
  test.assert(addSuccess, "Should have been able to add fire aspect enchantment to empty list");  

  test.succeed();
})
.structureName("ComponentTests:platform")
.tag(GameTest.Tags.suiteDefault);

GameTest.register("ItemEnchantmentsTests", "item_enchantments_conflict_prevent_adding", (test) => {
  const itemStack = new ItemStack(MinecraftItemTypes.ironSword);
  const enchantsComponent = itemStack.getComponent("minecraft:enchantments");
  const enchantments = enchantsComponent.enchantments;

  enchantments.addEnchantment(new Enchantment(MinecraftEnchantmentTypes.fireAspect, 2));
  let addSuccess = enchantments.addEnchantment(new Enchantment(MinecraftEnchantmentTypes.aquaAffinity, 1));

  test.assert(addSuccess == false, "Expected failure to add armor enchantment to sword");

  test.succeed();
})
.structureName("ComponentTests:platform")
.tag(GameTest.Tags.suiteDefault);

