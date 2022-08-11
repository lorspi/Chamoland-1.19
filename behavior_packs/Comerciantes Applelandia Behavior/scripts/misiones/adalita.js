import { ActionFormData, MessageFormData } from "mojang-minecraft-ui"
import { world } from "mojang-minecraft"
//import "scripts/dependencias/timer.js";

world.events.entityHit.subscribe(event => {

    //if (event.hitEntity && event.hitEntity.id == "npc:boy3") {
    if (event.hitEntity && event.hitEntity.id == "npc") {

        const player = event.entity
        const entity = event.hitEntity
        encantamientos(player)
    }
})

function encantamientos(player) {
    let form = new ActionFormData()
        form.title("Samuel") // Title of the GUI
        form.body("¿Ves esos bloques naranja? Son las últimas reserva de adalita del mundo. Al menos eso pensábamos. Hace poco un explorar dijo haber visto un escarabajo centellante en las cuevas frondosas. ¿Sabes qué significa eso?\n\nEsos escarabajos son la única fuente de adalita. Pensábamos que estaban extintos hace siglos. Pero ahora con este descubrimiento volvemos a tener esperanza de recuperar nuestra economía basada en esta gema. No sabemos qué tan real sea este hallazgo ¿Podrías ayudarme a conseguir una muestra de adalita? Te voy a compensar bien.") 
        form.button("Cuenta conmigo")
        form.button("Ya tengo la gema")
        form.button("Yo paso")

        form.show(player).then((response) => {
            if (response.selection === 0) {
                /*try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s unbreaking 3')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {
                        nocompatible(player)
                        player.runCommand('playsound random.break @s')
                    }                
                }catch {
                    noniveles(player)
                    player.runCommand('playsound random.break @s')
                }*/
            }
            if (response.selection === 1) {
                /*try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s depth_strider 3')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {
                        nocompatible(player)
                        player.runCommand('playsound random.break @s')
                    }                
                }catch {
                    noniveles(player)
                    player.runCommand('playsound random.break @s')
                }*/
            }
            if (response.selection === 2) {
                /*try{
                    player.runCommand('testfor @s[lm=20]')
                    try{
                        player.runCommand('enchant @s aqua_affinity')
                        player.runCommand('xp -20l @s')
                        player.runCommand('playsound random.orb @s')
                        encantado(player)
                    } catch {
                        nocompatible(player)
                        player.runCommand('playsound random.break @s')
                    }                
                }catch {
                    noniveles(player)
                    player.runCommand('playsound random.break @s')
                }*/
            }
            
        })
    }

function inicia_mision(player) {
    let temp = new MessageFormData()
        temp.title("Samuel")
        temp.body("¡Muchas gracias! Apenas tengas la muestra de adalita, regresa aquí a entregármela.")
        temp.button1(`¡Hasta luego!`) // Unforunately 'MessageFormData' Can only have 2 button i Suggest using 'ActionFormData'
        //temp.button2(`§4Cerrar`) // Cancels out the UI

        
       /* temp.show(player).then((response) => {  
            if (response.selection === 1) { 
                encantamientos(player)
            }
        })*/
    }

function no_tiene_gema(player) {
    let temp = new MessageFormData()
        temp.title("Samuel")
        temp.body("¿Que dices? No tienes la gema que necesito. Por favor ve a buscarla y regresa cuando la tengas.")
        temp.button1(`¡Hasta luego!`) 
        //temp.button2(`§4Cerrar`) 

        
        /*temp.show(player).then((response) => {  
            if (response.selection === 1) { 
                encantamientos(player)
            }
        })*/
    }

function tiene_gema(player) {
    let temp = new MessageFormData()
        temp.title("Samuel")
        temp.body("¡MARAVILLOSO! ¡SI ES REAL! Esto es una buena noticia para nuestro pueblo. Muchas gracias por tu ayuda. Toma tu recompensa como te lo prometí.")
        temp.button1(`Ha sido un placer`) 
        //temp.button2(`§4Cerrar`) 

        
        /*temp.show(player).then((response) => {  
            if (response.selection === 1) { 
                encantamientos(player)
            }
        })*/
    }


