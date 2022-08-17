import 'scripts/items.js'
import 'scripts/comandos.js'
import 'scripts/entidades.js'
import 'scripts/ticks.js'
import 'scripts/dormir.js'
import 'scripts/captura.js'
import 'scripts/particulas.js'
import 'scripts/luz.js'

import { chatrank } from 'scripts/chat.js'
import { world } from 'mojang-minecraft'
let tick = 0, worldLoaded = false, loadTime = 0;

world.events.beforeChat.subscribe((data) => {
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

