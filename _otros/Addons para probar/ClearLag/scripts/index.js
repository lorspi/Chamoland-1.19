//bridge-file-version: #5
//Imports
import { world as World } from "mojang-minecraft";

//Consts
const overworld = World.getDimension("overworld")

//Variabled
var clearlag = 0;

//Constant tick
World.events.tick.subscribe(() => {
	if(clearlag>0){
		clearlag = clearlag - 1
	}
	if(clearlag===300){
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lClearing all LAG in §o15seconds§r§c§l..."}]}')
	}else if(clearlag===200){
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lClearing all LAG in §o10seconds§r§c§l..."}]}')
	}else if(clearlag===100){
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lClearing all LAG in §o5seconds§r§c§l..."}]}')
	}else if(clearlag===80){
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lClearing all LAG in §o4seconds§r§c§l..."}]}')
	}else if(clearlag===60){
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lClearing all LAG in §o3seconds§r§c§l..."}]}')
	}else if(clearlag===40){
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lClearing all LAG in §o2seconds§r§c§l..."}]}')
	}else if(clearlag===20){
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lClearing all LAG in §o1seconds§r§c§l..."}]}')
	}else if(clearlag===1){
		try{
			var items = overworld.runCommand("testfor @e[type=item,type=tnt,type=snowball,type=arrow]").statusMessage.split(" ").length
			overworld.runCommand("kill @e[type=item,type=arrow,type=tnt,type=snowball]")
			overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lCleared all server LAG, §o"+items+"§r§c§l items were killed."}]}')
		}catch{
		overworld.runCommand('tellraw @a {"rawtext":[{"text":"§c§lCleared all server LAG, §o0§r§c§l items were killed."}]}')
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
        }
    }
})
