import { ActionFormData, MessageFormData } from "mojang-minecraft-ui"
import { world } from "mojang-minecraft"
//import "scripts/dependencias/timer.js";


//Consts
const overworld = world.getDimension("overworld")

//Variables
var validarherramienta = false
var validarmob = false
var herramienta = "npc:talismancap"
const mobs = ["cow", "sheep", "chicken" , "pig", "skeleton", "zombie", "wither_skeleton", "creeper", "zombie_villager", "villager", "villager_v2", "husk", "skeleton_horse", "donkey", "mule", "spider", "slime", "ghast", "zombie_pigman", "enderman", "cave_spider", "blaze", "magma_cube", "bat", "endermite", "guardian", "shulker", "squid", "glow_squid", "wolf", "mooshroom", "ocelot", "horse", "rabbit", "polar_bear", "llama", "parrot", "goat", "phantom", "fox", "turtle", "frog", "dolphin", "cat", "allay", "bee", "piglin"];

world.events.entityHit.subscribe(event => {

    if (event.hitEntity) {
        const player = event.entity
        const entity = event.hitEntity

        // Valida si golpea con el item correspondiente
        try {
            validarherramienta = player.runCommand(`testfor @s[hasitem={item=${herramienta},location=slot.weapon.mainhand,slot=0}]`).statusMessage.includes(`${player.name}`)
        } catch {
            validarherramienta = false

        }

        // Valida si el mob está en la lista de permitidos
        try {
            validarmob = mobs.includes(`${entity.id.substring(10)}`)
        } catch {
            validarmob = false
        }

        //overworld.runCommand(`tellraw @a {"rawtext":[{"text":"ID: ${entity.id.substring(10)}"}]}`)
        //overworld.runCommand(`tellraw @a {"rawtext":[{"text":"Herra: ${validarherramienta} Mob: ${validarmob}"}]}`)

        if(validarherramienta && validarmob){

            player.runCommand(`clear @s ${herramienta} 0 1`)
            
            if(entity.id.substring(10) == "villager_v2"){
                player.runCommand(`give ${player.name} villager_spawn_egg`)
            } else {
                player.runCommand(`give ${player.name} ${entity.id.substring(10)}_spawn_egg`)
            }

            player.runCommand(`playsound random.totem @s ~ ~ ~ 0.5`)
            player.runCommand(`particle minecraft:totem_particle ~ ~ ~`)
            player.runCommand(`particle minecraft:totem_particle ~ ~1 ~`)
            
            //player.runCommand(`kill @e[type=${entity.id}]`)
        } else if(validarherramienta && !validarmob){
            player.runCommand(`tellraw @s {"rawtext":[{"text":"§4No puedes replicar a esta criatura. Clic derecho con la herramienta para ver la lista completa."}]}`)
            player.runCommand(`playsound random.break @s`)
        }

        
    }
})


world.events.beforeItemUse.subscribe(data => {
    let { item, source } = data
    const player = data.source
    if (item.id == "npc:talismancap") { 
        capturables(player)                    
    }
})

function capturables(player) {
    let form = new ActionFormData()
        form.title("§l§5Replicador de criaturas") 
        form.body("Golpea una criatura para obtener una copia de ella en tu inventario.\n\nEstas son las entidades que puedes replicar con esta herramienta:\n\nVaca, Oveja, Gallina , Cerdo, Esqueleto, Zombie, Esqueleti Wither, Creeper, Aldeano, Aldeano Zombie, Husk, Caballo esqueleto, Burro, Mula, Araña, Araña de Cueva Slime, Ghast, Hombrecerdo zombie, Enderman, Blaze, Cubo de Magma, Murciélago, Endermite, Guardián, Shulker, Calamar, Calamar Brillante, Lobo, Champivaca, Ocelote, Caballo, Conejo, Oso Polar, Llama, Loro, Cabra, Phantom, Zorro, Tortuga, Rana, Delfín, Gato, Allay, Abeja, Piglin\n\n") 
        form.button("§4Cerrar") 

        form.show(player).then((response) => {
        if (response.selection === 0) {
            // ---
        }
    })
}


