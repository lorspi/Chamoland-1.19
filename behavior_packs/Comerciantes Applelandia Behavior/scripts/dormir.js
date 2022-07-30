//bridge-file-version: #5
//Imports
import { world as World } from "mojang-minecraft";
//import "scripts/dependencias/timer.js";

//Consts
const overworld = World.getDimension("overworld")

//Variables
var segundo = 0;
var noche = true;
var anuncio = true;

function isNight(currentTick){
    if(currentTick >= getDayLightCycle("night") && currentTick < getDayLightCycle("sunrise")){
        return true;
    }
    return false;
}


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
    if(hora>12000 && hora<23000) {noche = true} else {noche = false}

    let climaComando = World.getDimension("overworld").runCommand('weather query');
    let clima = climaComando.statusMessage.split(": ")
    
    // Se ejecuta cada segundo
    segundo = segundo + 1
    if(segundo===1){        
        //overworld.runCommand(`tellraw @a[name=lorspi] {"rawtext":[{"text":"Tiempo: ${clima[1]} - ${noche}"}]}`) // Debug noche
      }
    if(segundo===20){ 
        segundo = 0
    }

    if(noche==true || clima[1]=="thunder") {
        //overworld.runCommand(`tellraw @a[name=lorspi] {"rawtext":[{"text":"entra"}]}`)
        overworld.runCommand(`execute @a ~ ~ ~ detect ~ ~-1.5 ~ bed -1 time add 60`)
        overworld.runCommand(`weather clear`)
        if(anuncio==true){
            overworld.runCommand(`tellraw @a {"rawtext":[{"text":"\n   §l§a¡Alguien está en cama! §r Pronto saldrá el sol.\n "}]}`)
            overworld.runCommand(`playsound note.bell @a`)
            anuncio = false
        }
    } else {anuncio = true}
})





