//bridge-file-version: #5
//Imports
import { world as World } from "mojang-minecraft";
import "scripts/dependencias/timer.js";

//Consts
const overworld = World.getDimension("overworld")

//Variabled
var clearlag = 0;
var pvp = 0;
var pvpactivador = "Nadie";
var amorcontador = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


//Constant tick
World.events.tick.subscribe(() => {
    //Clearlag
    if(clearlag>0){
        clearlag = clearlag - 1
    }
    if(clearlag===300){
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lBorrando objetos en el suelo en §o10 segundos§r§c§l..."}]}')
    }
    if(clearlag===100){
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lBorrando objetos en el suelo en §o5 segundos§r§c§l..."}]}')
    }else if(clearlag===80){
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lBorrando objetos en el suelo en §o4 segundos§r§c§l..."}]}')
    }else if(clearlag===60){
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lBorrando objetos en el suelo en §o3 segundos§r§c§l..."}]}')
    }else if(clearlag===40){
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lBorrando objetos en el suelo en §o2 segundos§r§c§l..."}]}')
    }else if(clearlag===20){
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lBorrando objetos en el suelo en §o1 segundos§r§c§l..."}]}')
    }else if(clearlag===1){       
        try {var items = overworld.runCommand("testfor @e[type=item]").statusMessage.split(" ").length
        } catch {var items = 0}
        try {var arrow = overworld.runCommand("testfor @e[type=arrow]").statusMessage.split(" ").length
        } catch {var arrow = 0}
        try {var snowball = overworld.runCommand("testfor @e[type=snowball]").statusMessage.split(" ").length
        } catch {var snowball = 0}

        var total = items + snowball + arrow

        try {overworld.runCommand("kill @e[type=item]")} catch {}
        try {overworld.runCommand("kill @e[type=arrow]")} catch {}
        try {overworld.runCommand("kill @e[type=snowball]")} catch {}

        overworld.runCommand(`tellraw @a {"rawtext":[{"text":"§c§lFueron borrados ${total} objetos del suelo."}]}`)     
    }

    // Activación del PVP
    if(pvp>0){
        pvp = pvp - 1
    }
    if(pvp>5){
        overworld.runCommand(`title @a actionbar §c¡PVP activado temporalmente!`)
    }
    if(pvp===2400){ // 2400
        overworld.runCommand(`tellraw @a {"rawtext":[{"text":"\n§e§l${pvpactivador} §r§eha activado el PVP por 2 minutos.\n "}]}`)
        overworld.runCommand(`playsound beacon.activate @a`)
        overworld.runCommand(`gamerule pvp true`)
    }
    if(pvp===400){ //400
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§eEl PVP será desactivado en 20 segundos."}]}')
    }
    else if(pvp===1){
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§ePVP desactivado."}]}')
        overworld.runCommand(`title @a actionbar §a¡PVP desactivado!`)
        overworld.runCommand(`playsound beacon.deactivate @a`)
        overworld.runCommand(`gamerule pvp false`)
    }

    // Corazones
    amorcontador = amorcontador + 1
    if(amorcontador===10){ 
        overworld.runCommand(`execute @a[tag=amor] ~ ~ ~ particle minecraft:heart_particle ~${getRandomInt(-1, 2)} ~${getRandomInt(0, 3)} ~${getRandomInt(-1, 2)}`)
      }
    if(amorcontador===15){ 
        overworld.runCommand(`execute @a[tag=amor] ~ ~ ~ particle minecraft:heart_particle ~${getRandomInt(-1, 2)} ~${getRandomInt(0, 3)} ~${getRandomInt(-1, 2)}`)
    }
    if(amorcontador===20){ 
        overworld.runCommand(`execute @a[tag=amor] ~ ~ ~ particle minecraft:heart_particle ~${getRandomInt(-1, 2)} ~${getRandomInt(0, 3)} ~${getRandomInt(-1, 2)}`)
    }
    if(amorcontador===25){ 
        overworld.runCommand(`execute @a[tag=amor] ~ ~ ~ particle minecraft:heart_particle ~${getRandomInt(-1, 2)} ~${getRandomInt(0, 3)} ~${getRandomInt(-1, 2)}`)
    }
    if(amorcontador>30){ 
        amorcontador = 1
        overworld.runCommand(`execute @a[tag=amor] ~ ~ ~ particle minecraft:heart_particle ~${getRandomInt(-1, 2)} ~${getRandomInt(0, 3)} ~${getRandomInt(-1, 2)}`)
    }    
})

  
  
  

//On chat
World.events.beforeChat.subscribe(main => {
    let message = main.message
    let sender = main.sender
    let command = '!'
    var args = message.replace('!', '').split(' ')
    main.cancel = true
    if (message.startsWith(`${command}`)) {
        switch (args[0]) {
            case ('clearlag'): {
                try{
                    sender.runCommand('tellraw @s[tag=!staff] {"rawtext":[{"text":"§cNo tienes permiso. §o/tag (username) add staff§r"}]}')
                }catch{
                    clearlag = 301 //301
                }
                break
            }
            case ('amor'): {
                try{
                    sender.runCommand(`tellraw @s[tag=!amor] {"rawtext":[{"text":"§aCorazones activados"}]}`)
                    sender.runCommand('tag @s add amor')
                }catch{
                    sender.runCommand(`tellraw @s[tag=amor] {"rawtext":[{"text":"§cCorazones desactivados"}]}`)
                    sender.runCommand('tag @s remove amor')
                }
                break  
            }
            case ('spawn'): {
                try{
                    sender.runCommand('xp -15l @s[lm=15]')
                    sender.runCommand('tellraw @s {"rawtext":[{"text":"§l§2Preparando viaje...§r"}]}')
                    sender.runCommand('effect @s blindness 3')
                    setTimeout(() => {sender.runCommand('tp @s @e[type=hovertext:warp,name=kzjopw]');}, 40);
                    setTimeout(() => {sender.runCommand('playsound mob.shulker.teleport @p -1427 112 134');}, 42);
                    setTimeout(() => {sender.runCommand('playsound block.end_portal.spawn @p -1423 112 134 0.5');}, 42);
                    setTimeout(() => {sender.runCommand('particle minecraft:totem_particle -1425 112 134');}, 42);
                    setTimeout(() => {sender.runCommand('tellraw @s {"rawtext":[{"text":"§l§2¡Viaje finalizado!§r"}]}');}, 54);  
                    setTimeout(() => {sender.runCommand('particle minecraft:totem_particle -1425 112 134');}, 54);
                    setTimeout(() => {sender.runCommand('particle minecraft:totem_particle -1425 112 134');}, 56);
                    setTimeout(() => {sender.runCommand('particle minecraft:totem_particle -1425 112 134');}, 58);
                                      
                }catch{
                    sender.runCommand('tellraw @s {"rawtext":[{"text":"§l§4No tienes suficiente experiencia para viajar.\n§rNecesitas 15 niveles.§r"}]}')
                    sender.runCommand('playsound random.break @s')
                }
                break
            }
            case ('xp'): {
                try{
                    sender.runCommand('xp -15l @s[lm=15]')
                    sender.runCommand('give @s appleplus:masa_de_experiencia 1')
                    sender.runCommand('playsound random.levelup @s')
                    sender.runCommand('tellraw @s {"rawtext":[{"text":"§l§2¡Has recibido una Masa de experiencia!\n§rGuárdala en un lugar seguro.§r"}]}')
                    
                }catch{
                    sender.runCommand('tellraw @s {"rawtext":[{"text":"§l§4No tienes suficiente experiencia para guardar.\n§rRecuerda que necesitas 15 niveles de experiencia.§r"}]}')
                    sender.runCommand('playsound random.break @s')
                }
                break
            }
            case ('pvp'): {
                if(pvp>0){
                    pvp = 20
                    pvpactivador = main.sender.name
                    overworld.runCommand(`tellraw @a {"rawtext":[{"text":"§e§l${pvpactivador} §r§eha desactivado el PVP."}]}`)
                }
                else {
                    pvp = 2401 // 2401
                    pvpactivador = main.sender.name
                }
                
            }
            case ('chat'): {
                let etiqueta = sender.getTags().includes("silenciochat")
                //sender.runCommand(`tellraw @a {"rawtext":[{"text":"Valor: ${etiqueta}"}]}`)
                
                if(etiqueta==true){
                    sender.runCommand(`tag ${sender.name} remove silenciochat`)
                    sender.runCommand(`tellraw @a {"rawtext":[{"text":"§aHas activado el sonido del chat"}]}`)
                }
                else {
                    sender.runCommand(`tag ${sender.name} add silenciochat`)
                    sender.runCommand(`tellraw @a {"rawtext":[{"text":"§cHas desactivado el sonido del chat."}]}`)
                }
            }
        }
    }
})
