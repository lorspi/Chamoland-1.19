import { ActionFormData, MessageFormData } from "mojang-minecraft-ui"
import { world } from "mojang-minecraft"
//import "scripts/dependencias/timer.js";

world.events.entityHit.subscribe(event => {

    if (event.hitEntity && event.hitEntity.id == "npc:boy3") {

        const player = event.entity
        const entity = event.hitEntity
        encantamientos(player)
    }
})

function encantamientos(player) {
    let form = new ActionFormData()
        form.title("§l§5Encantamientos") // Title of the GUI
        form.body("Elige el encantamiento para aplicar a tu objeto en mano.\n\nCada encantamiento te cobra niveles de experiencia.\n\n") 
        form.button("§l§5Irrompible III\n§r§820 niveles")
        form.button("§l§5Agilidad acuática III\n§r§820 niveles")
        form.button("§l§5Afinidad acuática\n§r§820 niveles")
        form.button("§l§5Respiración III\n§r§820 niveles")
        form.button("§l§5Saqueo 3\n§r§830 niveles")
        form.button("§l§5Toque de seda\n§r§820 niveles")
        form.button("§l§5Lealtad III\n§r§820 niveles")
        form.button("§l§5Protección IV\n§r§820 niveles")
        form.button("§l§5Fortuna III\n§r§830 niveles")
        form.button("§l§5Reparación\n§r§860 niveles")

        form.show(player).then((response) => {
            if (response.selection === 0) {
                try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s unbreaking 3')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 1) {
                try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s depth_strider 3')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 2) {
                try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s aqua_affinity')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 3) {
                try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s respiration 3')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 4) {
                try{
                    player.runCommand('testfor @s[lm=30]')
                    try{
                        player.runCommand('enchant @s looting 3')
                        player.runCommand('xp -30l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 5) {
                try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s silk_touch')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 6) {
                try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s loyalty 3')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 7) {
                try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s protection 4')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 8) {
                try{
                    player.runCommand('testfor @s[lm=30]')
                    try{
                        player.runCommand('enchant @s fortune 3')
                        player.runCommand('xp -30l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
            if (response.selection === 9) {
                try{
                    player.runCommand('testfor @s[lm=60]')
                    try{
                        player.runCommand('enchant @s mending')
                        player.runCommand('xp -60l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {nocompatible(player)}                
                }catch{noniveles(player)}
            }
        })
    }

function nocompatible(player) {
    let temp = new MessageFormData()
        temp.title("§4§lNo se puede encantar")
        temp.body("El encantamiento no es compatible con este objeto o ya tiene el encantamiento aplicado.")
        temp.button1(`§4< Volver`) // Unforunately 'MessageFormData' Can only have 2 button i Suggest using 'ActionFormData'
        temp.button2(`§4Cerrar`) // Cancels out the UI

        
        temp.show(player).then((response) => {  
            if (response.selection === 1) { 
                encantamientos(player)
            }
        })
    }

function noniveles(player) {
    let temp = new MessageFormData()
        temp.title("§4§lNo se puede encantar")
        temp.body("No tienes suficientes niveles de experiencia para aplicar este encantamiento.")
        temp.button1(`§4< Volver`) 
        temp.button2(`§4Cerrar`) 

        
        temp.show(player).then((response) => {  
            if (response.selection === 1) { 
                encantamientos(player)
            }
        })
    }

function encantado(player) {
    let temp = new MessageFormData()
        temp.title("§2§lObjeto encantado")
        temp.body("Se le ha aplicado el encantamiento al objeto en tu mano.")
        temp.button1(`§4< Volver`) 
        temp.button2(`§4Cerrar`) 

        
        temp.show(player).then((response) => {  
            if (response.selection === 1) { 
                encantamientos(player)
            }
        })
    }


world.events.entityHurt.subscribe(function (event) {
    const damage = event.damage
    const hurtEntity = event.hurtEntity
    //const entity = world.getDimension("overworld").spawnEntity("test:damage_indicator", hurtEntity.location)
    overworld.runCommand('tellraw @a {"rawtext":[{"text":"Herida entidad"}]}')
})

