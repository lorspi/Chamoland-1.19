//bridge-file-version: #5
//Imports
import { world as World } from "mojang-minecraft";
import "scripts/dependencias/timer.js";

//Consts
const overworld = World.getDimension("overworld")

//Variabled
var clearlag = 0;
var spawn = 0;

//Constant tick
World.events.tick.subscribe(() => {
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
        try{
            var items = overworld.runCommand("testfor @e[type=item,type=tnt,type=snowball,type=arrow]").statusMessage.split(" ").length
            overworld.runCommand("kill @e[type=item,type=arrow,type=tnt,type=snowball]")
            overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lFueron borrados §o"+items+"§r§c§l objetos del suelo."}]}')
        }catch{
        overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lFueron borrados §o0§r§c§l objetos del suelo."}]}')
        }
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
                    sender.runCommand('tellraw @s[tag=!staff] {"rawtext":[{"text":"§cYou need the §lstaff§r§c tag to use this command. Please ask an operator to run §o/tag (username) add staff§r"}]}')
                }catch{
                    clearlag = 301
                }
                break
            }
            case ('spawn'): {
                try{
                    sender.runCommand('xp -10l @s[lm=10]')
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
        }
    }
})
