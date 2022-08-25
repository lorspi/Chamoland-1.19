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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function particulas(player) {
  // Generación de partículas v2
  player.runCommand(`playsound particle.soul_escape @s ~ ~ ~`)
  for (var i = 0; i < 50; i++) {
    try{
        setTimeout(() => {player.runCommand(`particle minecraft:soul_particle ~${getRandomInt(-3, 3)} ~${getRandomInt(1, 4)} ~${getRandomInt(-3, 3)}`)}, i);
    } catch{}         
  }
  setTimeout(() => {player.runCommand(`playsound particle.soul_escape @s ~ ~ ~`)}, 50);  
}

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
    if (item.id == "appleplus:amuleto") { 
      //checkpoint(player)
      //player.runCommand(`clear @s appleplus:amuleto 0 1`)
      try {
          player.runCommand(`tellraw @s {"rawtext":[{"text":"§aViajaste al punto de control."}]}`)
          player.runCommand(`tp @s @e[type=hovertext:warp,name=Punto]`)
      } catch {
          player.runCommand(`tellraw @s {"rawtext":[{"text":"§cNo puedes viajar al punto de control."}]}`)
      }
    }
    if (item.id == "appleplus:casa") { 
      player.runCommand(`summon hovertext:hovertext ""`)
    }
    if (item.id == "appleplus:aldea") { 
      player.runCommand(`kill @e[name=]`)
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
          particulas(player)
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
          particulas(player)
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
          particulas(player)
          player.runCommand('summon creeper  ~2 ~1 ~')
          player.runCommand('summon creeper  ~2 ~1 ~')
          player.runCommand('summon creeper  ~2 ~1 ~')
          player.runCommand(`clear @s appleplus:cluster_de_almas 0 1`)
          setTimeout(() => {player.runCommand('damage @e[name=,r=10,tag=!segura] 19');}, 5);
          setTimeout(() => {player.runCommand('tag @e[name=,r=10] add segura');}, 10);
        }
        if (response.selection === 3) {
          particulas(player)
          player.runCommand('summon wither_skeleton  ~2 ~1 ~')
          player.runCommand('summon wither_skeleton  ~2 ~1 ~')
          player.runCommand(`clear @s appleplus:cluster_de_almas 0 1`)
          setTimeout(() => {player.runCommand('damage @e[name=,r=10,tag=!segura] 19');}, 5);
          setTimeout(() => {player.runCommand('tag @e[name=,r=10] add segura');}, 10);
        }
    })
}

function checkpoint(player) {
  let form = new ActionFormData()
      form.title("Punto de control") 
      //form.body("#####") 
      form.button("Guardar") 
      form.button("Cargar")
      form.button("Borrar")

      form.show(player).then((response) => {
      if (response.selection === 0) {
        //particulas(player)
        try {
            player.runCommand(`testfor @e[type=hovertext:hovertext,name=" ${player.name}"]`)
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§aPunto de control guardado."}]}`)
            player.runCommand(`tp @e[type=hovertext:hovertext,name=" ${player.name}"] @s`)
        } catch {
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§aPunto de control creado."}]}`)
            player.runCommand(`summon hovertext:hovertext " ${player.name}"`)
        }
      }
      if (response.selection === 1) {
        //particulas(player)
        try {
            player.runCommand(`testfor @e[type=hovertext:hovertext,name=" ${player.name}"]`)
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§aViajaste a tu punto de control."}]}`)
            player.runCommand(`tp @s @e[type=hovertext:hovertext,name=" ${player.name}"] `)
        } catch {
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§cNo has guardado ningún punto de control."}]}`)
        }
      }
      if (response.selection === 2) {
        //particulas(player)
        try {
            player.runCommand(`kill @e[type=hovertext:hovertext,name=" ${player.name}"]`)
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§aPunto de control borrado."}]}`)
        } catch {
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§cNo has guardado ningún punto de control."}]}`)
        }
      }
  })
}