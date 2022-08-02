import { ActionFormData, MessageFormData } from "mojang-minecraft-ui"
import { world } from "mojang-minecraft"
//import "scripts/dependencias/timer.js";


//Consts
const overworld = world.getDimension("overworld")

//Variables
var validarherramienta = false
var validarmob = false
var herramienta = "npc:talismancap"
const mobs = ["cow", "sheep", "chicken" , "pig", "skeleton", "zombie", "wither_skeleton", "creeper", "zombie_villager", "villager", "husk", "skeleton_horse", "donkey", "mule", "spider", "slime", "ghast", "zombie_pigman", "enderman", "cave_spider", "blaze", "magma_cube", "bat", "endermite", "guardian", "shulker", "squid", "wolf", "mooshroom", "ocelot", "horse", "rabbit", "polar_bear", "llama", "parrot", "goat", "phantom", "fox", "turtle", "frog", "dolphin"];

world.events.entityHit.subscribe(event => {

    if (event.hitEntity) {
        const player = event.entity
        const entity = event.hitEntity

        // Valida si golpea con el item correspondiente
        try {
            validarherramienta = player.runCommand(`testfor @s[hasitem={item=${herramienta},location=slot.weapon.mainhand,slot=0}]`).statusMessage.includes(`${event.entity.name}`)
        } catch {
            validarherramienta = false

        }

        // Valida si el mob está en la lista de permitidos
        try {
            validarmob = mobs.includes(`${event.hitEntity.id.substring(10)}`)
        } catch {
            validarmob = false
        }

        if(validarherramienta && validarmob){

            player.runCommand(`clear @s ${herramienta} 0 1`)
            player.runCommand(`give ${event.entity.name} ${event.hitEntity.id.substring(10)}_spawn_egg`)

            player.runCommand(`playsound random.totem @s ~ ~ ~ 0.5`)
            player.runCommand(`particle minecraft:totem_particle ~ ~ ~`)
            player.runCommand(`particle minecraft:totem_particle ~ ~1 ~`)
            
            //player.runCommand(`kill @e[type=${event.hitEntity.id}]`)
        }

        
    }
})


