//bridge-file-version: #5
//Imports
import { world as World } from "@minecraft/server";

//Consts
const overworld = World.getDimension("overworld")

//Variables
var noche = true;
var anuncio = true;
var dormidos = 0;

World.events.beforeItemUseOn.subscribe((useOn) =>{
    let player = useOn.source;
    if(block.id == "minecraft:bed"){
        player.runCommand(`tellraw @a {"rawtext":[{"text":"Durmiendo"}]}`);
      } 
});

//Constant tick
World.events.tick.subscribe(() => {
    let horaComando = World.getDimension("overworld").runCommand('time query daytime');
    let hora = JSON.stringify(horaComando.statusMessage).match(/[0-9]+/i);
    if(hora>12000 && hora<23500) {noche = true} else {noche = false}

    let climaComando = World.getDimension("overworld").runCommand('weather query');
    let clima = climaComando.statusMessage.split(": ")

    try{
        overworld.runCommand(`execute @a ~ ~ ~ detect ~ ~-1.5 ~ bed -1 tag @s add dormido`)
    } catch {}

    try {
        dormidos = overworld.runCommand("testfor @a[tag=dormido]").statusMessage.split(" ").length
    } catch {
        dormidos = 0
    }

    if(dormidos>1) {
        if(noche==true || clima[1]=="thunder") {
            overworld.runCommand(`time add 60`)
            overworld.runCommand(`weather clear`)
            if(anuncio==true){
                overworld.runCommand(`tellraw @a {"rawtext":[{"text":"\n   §l§a¡Alguien está en cama!\n§r  Pronto saldrá el sol.\n "}]}`)
                overworld.runCommand(`playsound note.bell @a`)
                anuncio = false
            }
        } else {
            overworld.runCommand(`tag @a remove dormido`)
            anuncio = true
        }
    } else {}
})





