import { ActionFormData, MessageFormData } from "mojang-minecraft-ui"
import { world } from "mojang-minecraft"
import "scripts/dependencias/timer.js";

/**
 * Pack Made By LVRAID3RS#4808
 * Thank You For Checking out my Content 
 * 
 * Socials
 * Discord: https://discord.gg/r6QCtP4mV8
 * YouTube: LVRAID3RS
 */

 world.events.beforeItemUse.subscribe(data => {
    let { item, source } = data
    const player = data.source
    if (item.id == "npc:talisman") {  // Item.id is set to dirt currently you can change to any item
        player.runCommand('clear @s npc:talisman 0 1')
        player.runCommand('tellraw @s {"rawtext":[{"text":"§l§2Preparando viaje...§r"}]}')
        player.runCommand('effect @s blindness 3')
        setTimeout(() => {player.runCommand('tp @s @e[type=hovertext:warp,name=kzjopw]');}, 40);
        setTimeout(() => {player.runCommand('playsound mob.shulker.teleport @p -1427 112 134');}, 42);
        setTimeout(() => {player.runCommand('playsound block.end_portal.spawn @p -1423 112 134 0.5');}, 42);
        setTimeout(() => {player.runCommand('particle minecraft:totem_particle -1425 112 134');}, 42);
        setTimeout(() => {player.runCommand('tellraw @s {"rawtext":[{"text":"§l§2¡Viaje finalizado!§r"}]}');}, 54);  
        setTimeout(() => {player.runCommand('particle minecraft:totem_particle -1425 112 134');}, 54);
        setTimeout(() => {player.runCommand('particle minecraft:totem_particle -1425 112 134');}, 56);
        setTimeout(() => {player.runCommand('particle minecraft:totem_particle -1425 112 134');}, 58);                         
    }
    if (item.id == "appleplus:masa_de_experiencia") {  // Item.id is set to dirt currently you can change to any item
      player.runCommand(`clear @s appleplus:masa_de_experiencia 0 1`)
      player.runCommand(`playsound random.levelup @s`)
      player.runCommand(`xp 15l @s`)
      player.runCommand('tellraw @s {"rawtext":[{"text":"§l§2¡Has recibido 15 niveles de experiencia!§r"}]}')
    }
    if (item.id == "npc:girl2_spawn_egg") {  // Item.id is set to dirt currently you can change to any item
      player.runCommand(`clear @s npc:girl2_spawn_egg 0 1`)
      player.runCommand('give @s npc:talisman 1')
      player.runCommand(`playsound mob.blaze.shoot @s`)
      player.runCommand('tellraw @s {"rawtext":[{"text":"§l§2¡Se te ha actualizado el talismán!\n§rAhora puedes usarlo sin tocar el suelo.§r"}]}')
    }
    if (item.id == "appleplus:cluster_de_almas") { 
      invocar(player)
    }
  })


// Invocador de criaturas

function invocar(player) {
    let form = new ActionFormData()
        form.title("§l§1Invocador de criaturas") 
        form.body("Selecciona las criaturas debilitadas que quieres invocar.\n\nLas criaturas se invocarán a dos bloques hacia el este. (Por donde sale el sol.)") 
        form.button("§l5 Zombies") 
        form.button("§l5 Esqueletos")
        form.button("§l3 Creepers")
        form.button("§l2 Esqueletos wither")

        form.show(player).then((response) => {
        if (response.selection === 0) {
            player.runCommand('summon zombie  ~2 ~1 ~')
            player.runCommand('summon zombie  ~2 ~1 ~')
            player.runCommand('summon zombie  ~2 ~1 ~')
            player.runCommand('summon zombie  ~2 ~1 ~')
            player.runCommand('summon zombie  ~2 ~1 ~')
            player.runCommand(`clear @s appleplus:cluster_de_almas 0 1`)
            setTimeout(() => {player.runCommand('damage @e[name=,r=10,tag=!segura] 19');}, 5);
            setTimeout(() => {player.runCommand('tag @e[name=,r=10] add segura');}, 10);
        }
        if (response.selection === 1) {
            player.runCommand('summon skeleton  ~2 ~1 ~')
            player.runCommand('summon skeleton  ~2 ~1 ~')
            player.runCommand('summon skeleton  ~2 ~1 ~')
            player.runCommand('summon skeleton  ~2 ~1 ~')
            player.runCommand('summon skeleton  ~2 ~1 ~')
            player.runCommand(`clear @s appleplus:cluster_de_almas 0 1`)
            setTimeout(() => {player.runCommand('damage @e[name=,r=10,tag=!segura] 19');}, 5);
            setTimeout(() => {player.runCommand('tag @e[name=,r=10] add segura');}, 10);
        }
        if (response.selection === 2) {
            player.runCommand('summon creeper  ~2 ~1 ~')
            player.runCommand('summon creeper  ~2 ~1 ~')
            player.runCommand('summon creeper  ~2 ~1 ~')
            player.runCommand(`clear @s appleplus:cluster_de_almas 0 1`)
            setTimeout(() => {player.runCommand('damage @e[name=,r=10,tag=!segura] 19');}, 5);
            setTimeout(() => {player.runCommand('tag @e[name=,r=10] add segura');}, 10);
        }
        if (response.selection === 3) {
            player.runCommand('summon wither_skeleton  ~2 ~1 ~')
            player.runCommand('summon wither_skeleton  ~2 ~1 ~')
            player.runCommand(`clear @s appleplus:cluster_de_almas 0 1`)
            setTimeout(() => {player.runCommand('damage @e[name=,r=10,tag=!segura] 19');}, 5);
            setTimeout(() => {player.runCommand('tag @e[name=,r=10] add segura');}, 10);
        }
    })
}