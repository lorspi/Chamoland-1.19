import {world, ItemStack, MinecraftItemTypes,Items, EffectType, MinecraftEffectTypes} from "mojang-minecraft";
import { Enchantments } from "scripts/classes/Enchantments.js";

world.events.effectAdd.subscribe((eventData)=>{
	let effectName = eventData.effect.displayName;
	let effectAmp = eventData.effect.amplifier;
	let entityId = eventData.entity.id;
	let entity = eventData.entity;
	
	//entity.runCommand(`say ${MinecraftEffectTypes.blindness.getName()}:${(effectName.split(' '))[0].toLowerCase()}`);
	
	let delay = 0;
		if(entityId == "disenchanter:disenchanting_table"){
			//entity.runCommand(`say test2`);
			if(effectAmp == 2){
				//entity.runCommand(`say test3`);
				let tickCall = world.events.tick.subscribe((eventData)=>{
					let inventory;
					let amethyst;
					try{
					inventory = entity.getComponent('inventory').container;
					amethyst = inventory.getItem(9);
					}catch(e){
						world.events.tick.unsubscribe(tickCall);
						return;
					}
					if(inventory.getItem(0) && (amethyst && (amethyst.id == 'minecraft:amethyst_shard'))){
					let isEnchanted = Enchantments.getEnchants(inventory.getItem(0)).length;
						if(isEnchanted>0){
							delay++;
							if(delay >= 20){
							try{	
							//entity.nameTag = "§r§rdisenchanting Table";	
							entity.runCommand(`effect @s clear`);
							}catch(e){
								
							//entity.nameTag = "§r§rdisenchanting Table";	
							entity.runCommand(`effect @s blindness 1 3 true`);	
							delay = 0;
							entity.runCommand(`event entity @s reset`);
							world.events.tick.unsubscribe(tickCall);
							}
							}
						}else{
							delay = 0;		
							world.events.tick.unsubscribe(tickCall);
							try{				
							entity.runCommand(`effect @s clear`);
							entity.runCommand(`event entity @s reset`);
							}catch(e){
							entity.runCommand(`event entity @s reset`);
							}
						}
					}else{
					delay = 0;		
					world.events.tick.unsubscribe(tickCall);
					}
				});
			}
			
			if(effectAmp == 3){
				let amethystDecrease = 0;
				let inventory = entity.getComponent('inventory').container;
				let getEnchantedItem = inventory.getItem(0);
				if(!getEnchantedItem) return;
				let enchants = Enchantments.getEnchants(getEnchantedItem);
				let enchantsCount = enchants.length;
				let count = 0;
				let itemSlot = 0;
					for(let enchant of enchants){
						itemSlot = 0;
						for(let repeat = 1; repeat < 9; repeat++){
						if(count > enchantsCount) break;
						if(itemSlot > 8) break;
						itemSlot++;
							let getBook = inventory.getItem(itemSlot);
							if(!getBook) continue;
							if(getBook.id != "minecraft:book") continue;
							getBook = new ItemStack(MinecraftItemTypes.enchantedBook,1,0);
								try{
								//entity.runCommand(`say enchanting`);
								repeat = 10;
								getEnchantedItem = inventory.getItem(0);
								let newBook = Enchantments.setEnchant(getBook, enchant.type.id, enchant.level);
								inventory.setItem(itemSlot,newBook);
								let mainBook = Enchantments.removeEnchant(getEnchantedItem,enchant.type.id);
								inventory.setItem(0,mainBook);
								count++;
								amethystDecrease++;
								}catch(e){
								entity.runCommand(`say ${e}`);	
								}
						}								
					}
					if(amethystDecrease>0){
					let amethyst = inventory.getItem(9);
					let amethystAmount = amethyst.amount;
					inventory.setItem(9,new ItemStack(Items.get('minecraft:amethyst_shard'),amethystAmount-1,0));
					}
					getEnchantedItem = inventory.getItem(0);
					if(getEnchantedItem.id == "minecraft:enchanted_book"){
						enchants = Enchantments.getEnchants(getEnchantedItem);
						if(enchants.length != 0) return;
						inventory.setItem(0, new ItemStack(MinecraftItemTypes.book,1,0));
					}
					//entity.nameTag = "§r§r§rdisenchanting Table";
					//eventData.entity.runCommand(`say Disenchanting Done`);
			}
		}
		//eventData.entity.runCommand(`say ${effectName}:${effectAmp}`);
});