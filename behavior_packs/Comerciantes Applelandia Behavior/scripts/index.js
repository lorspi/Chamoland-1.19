import 'scripts/items.js'
import 'scripts/comandos.js'
import 'scripts/entidades.js'

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
        world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"World has loaded in ${loadTime} ticks!"}]}`)
    }
})
