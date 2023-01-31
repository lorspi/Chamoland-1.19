//import "items.js"
//import "comandos.js"
//import "entidades.js"
//import "ticks.js"
//import "dormir.js"
//import "captura.js"
//import "particulas.js"
//import "luz.js"

import { chatrank } from "chat.js"
import { world } from "@minecraft/server"
let tick = 0, worldLoaded = false, loadTime = 0;

world.events.beforeChat.subscribe((data) => {
    overworld.runCommand('playsound random.orb @a') //Prueba si entra en el evento
    chatrank(data)
})
world.events.tick.subscribe((ticks) => {
    tick++
    if (!world.getDimension("overworld").runCommand('testfor @a').error && !worldLoaded) {
        loadTime = tick
        worldLoaded = true;
        world.getDimension("overworld").runCommand(`tellraw @a[name=lorspi] {"rawtext":[{"text":"¡Mundo cargado en ${loadTime} ticks!"}]}`)
    }
})

//Constant tick
world.events.tick.subscribe(() => {
    // Reproducir sonido una sola vez al pasar sobre un bloque específico.
    overworld.runCommand('execute @a ~ ~ ~ detect ~ ~-2 ~ npc:adalita_block 0 playsound random.orb @p')    
})
