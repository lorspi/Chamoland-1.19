//bridge-file-version: #5
//Imports
import { world as World } from "mojang-minecraft";
//import "scripts/dependencias/timer.js";

//Consts
const overworld = World.getDimension("overworld")
const tiempotiendas = 800

//Variables
//var sonido = 0;
var segundo = 0;

//Constant tick
World.events.tick.subscribe(() => {
    // Aplica ceguera al pisar sobre bloque específico.
    //overworld.runCommand('execute @a ~ ~ ~ detect ~ ~-2 ~ npc:adalita_block 0 effect @p blindness 2')    
    
    // Reproducir sonido una sola vez al pasar sobre un bloque específico.
    /*if(sonido===0){ 
        overworld.runCommand('execute @a ~ ~ ~ detect ~ ~-2 ~ npc:adalita_block 0 playsound random.orb @p')
        sonido = 1
    }*/

    // Modo de juego en el spawn
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ gamemode s @a[rm=80,r=300,m=a]`)} catch {}
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ gamemode a @a[r=80,m=s]`)} catch {}

    // Matar criaturas en el spawn
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ kill @e[type=zombie,r=80]`)} catch {}
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ kill @e[type=creeper,r=80]`)} catch {}
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ kill @e[type=skeleton,r=80]`)} catch {}
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ kill @e[type=spider,r=80]`)} catch {}
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ kill @e[type=zombie_villager,r=80]`)} catch {}

    // Modo de juego en los campamentos
    //summon hovertext:warp Campamento
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=Campamento] ~ ~ ~ gamemode s @a[rm=20,r=40,m=a]`)} catch {}
    try{overworld.runCommand(`execute @e[type=hovertext:warp,name=Campamento] ~ ~ ~ gamemode a @a[r=20,m=s]`)} catch {}


    //---------------

    let jugadores = overworld.runCommand(`testfor @a`).statusMessage.substring(6,1000).split(", ")
    let cantjugadores = overworld.runCommand(`testfor @a`).statusMessage.substring(5,1000).split(", ").length

    for (var i = 0; i < cantjugadores; i++) {
        try {
            overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ clear "${jugadores[i]}" appleplus:masa_de_experiencia 0 0`)
            overworld.runCommand(`scoreboard players set "${jugadores[i]}" TieneMasa 1`)
        } catch {
            overworld.runCommand(`scoreboard players set "${jugadores[i]}" TieneMasa 0`)
        }
    }

    // Matar npc obsoleto
    overworld.runCommand(`kill @e[type=npc:girl2]`)

    //

    // Probar si el jugador tiene masa en el inventario
    /*try {
        overworld.runCommand(`execute @e[type=hovertext:warp,name=kzjopw] ~ ~ ~ clear @p[r=60] appleplus:masa_de_experiencia 0 0`)
        overworld.runCommand(`scoreboard players set @p TieneMasa 1`)
    } catch {
        overworld.runCommand(`scoreboard players set @p TieneMasa 0`)
    }*/

    //---------------
    
    
    

    
    // Se ejecuta cada segundo a partir de esta línea
    segundo = segundo + 1
    if(segundo===1){ 
        var tienda = overworld.runCommand("scoreboard players list @e[name=Tiendas]").statusMessage.split("\n")
        var numero = tienda[1].split(" ")
        //overworld.runCommand(`title @a[name=lorspi] actionbar §cRestante comercio: ${tiempotiendas-numero[2]}`) // Cuenta regresiva en segs
        overworld.runCommand(`scoreboard players add @e[name=Tiendas] tiendascont 1`)
        overworld.runCommand(`effect @e[type=hovertext:warp] invisibility 5`)
      }
    if(segundo===20){ 
        segundo = 0
    }

    // Sistema de comercio

    /*
    scoreboard objectives add tiendascont dummy
    scoreboard players list @e[name=Tiendas]
    scoreboard players add @e[name=Tiendas] tiendascont 1
    scoreboard players set @e[name=Tiendas] tiendascont 1
    summon hovertext:warp Tiendas
    */

    if(numero[2]>tiempotiendas) { // Reinicio
        overworld.runCommand(`scoreboard players set @e[name=Tiendas] tiendascont 1`)
    }
    /*if(numero[2]>tiempotiendas-10) { // Anuncio reinicio
        overworld.runCommand(`title @a actionbar §cSe reiniciarán las tiendas.`)
    }*/

    if(numero[2]==2) { // Matar
        overworld.runCommand(`execute @e[name=Tiendas] ~ ~ ~ kill @e[type=npc:boy2,r=5]`)
        overworld.runCommand(`execute @e[name=Tiendas] ~ ~ ~ kill @e[type=npc:boy3,r=5]`)
    }

    if(numero[2]==3) { // Crear
        overworld.runCommand(`execute @e[name=Tiendas] ~ ~ ~ summon npc:boy2 ~ ~ ~1`)
        overworld.runCommand(`execute @e[name=Tiendas] ~ ~ ~ summon npc:boy3 ~ ~ ~-1`)
    }
    if(numero[2]==4) { // Anunciar
        overworld.runCommand(`tellraw @a {"rawtext":[{"text":"\n    §l§aComerciantes \n§r  ¡Inventarios actualizados!\n  Nuevas ofertas de compra y venta disponibles.\n "}]}`)
        overworld.runCommand(`playsound note.bell @a`)
    }

    
})






