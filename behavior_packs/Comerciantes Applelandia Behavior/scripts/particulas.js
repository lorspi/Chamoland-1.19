//bridge-file-version: #5
//Imports
import { world as World } from "@minecraft/server";
import "dependencias/timer.js";

//Consts
const overworld = World.getDimension("overworld")
const nether = World.getDimension("nether")

//Variables
var escarabajo = 0;
var almas = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//Constant tick
World.events.tick.subscribe(() => {
 
    // Partícula de escarabajo
    escarabajo = escarabajo + 1
    if(escarabajo===1){ 
        try {
            overworld.runCommand(`execute @e[type=appleplus:escarabajo] ~ ~ ~ particle minecraft:balloon_gas_particle ~${getRandomInt(0, 1)} ~0.${getRandomInt(2, 9)} ~${getRandomInt(0, 1)}`)
        } catch {}
    }
    if(escarabajo===50){ 
        try {
            overworld.runCommand(`execute @e[type=appleplus:escarabajo] ~ ~ ~ particle minecraft:balloon_gas_particle ~${getRandomInt(-1, 2)} ~0.${getRandomInt(2, 9)} ~${getRandomInt(-1, 2)}`)
        } catch {}
    }
    if(escarabajo===100){ 
        escarabajo = 0
    }

    // Partícula de arena de
    almas = almas + 1
    if(almas===1){ 
        try {
            overworld.runCommand(`execute @a ~ ~ ~ detect ~ ~-1 ~ minecraft:soul_sand 0 particle minecraft:soul_particle ~${getRandomInt(-3, 4)} ~1 ~${getRandomInt(-3, 4)}`)
        } catch {}
        try {
            overworld.runCommand(`execute @a ~ ~ ~ detect ~ ~-1 ~ minecraft:soul_soil 0 particle minecraft:soul_particle ~${getRandomInt(-3, 4)} ~1 ~${getRandomInt(-3, 4)}`)
        } catch {}
        try {
            nether.runCommand(`execute @a ~ ~ ~ detect ~ ~-1 ~ minecraft:soul_sand 0 particle minecraft:soul_particle ~${getRandomInt(-3, 4)} ~1 ~${getRandomInt(-3, 4)}`)
        } catch {}
        try {
            nether.runCommand(`execute @a ~ ~ ~ detect ~ ~-1 ~ minecraft:soul_soil 0 particle minecraft:soul_particle ~${getRandomInt(-3, 4)} ~1 ~${getRandomInt(-3, 4)}`)
        } catch {}
    }
    if(almas===28){ 
        almas = 0
    }
})







