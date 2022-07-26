import { ActionFormData, MessageFormData } from "mojang-minecraft-ui"
import { world } from "mojang-minecraft"

/**
 * Pack Made By LVRAID3RS#4808
 * Thank You For Checking out my Content 
 * 
 * Socials
 * Discord: https://discord.gg/r6QCtP4mV8
 * YouTube: LVRAID3RS
 */



 world.events.beforeItemUse.subscribe(data => {
    let { item, source } = data
    const player = data.source
    if (item.id == "minecraft:golden_axe") {  // Item.id is set to dirt currently you can change to any item
      ui(player)
    }
    if (item.id == "appleplus:masa_de_experiencia") {  // Item.id is set to dirt currently you can change to any item
      player.runCommand(`clear @s appleplus:masa_de_experiencia 0 1`)
      player.runCommand(`playsound random.levelup @s`)
      player.runCommand(`xp 15l @s`)
      player.runCommand('tellraw @s {"rawtext":[{"text":"§l§2¡Has recibido 15 niveles de experiencia!§r"}]}')
    }
  })

/**
 * Show the ui to the player
 * @param {player} player Player to show the ui to
 */

// Page 1

function ui(player) {
    let form = new ActionFormData()
        form.title("§l§1GUI Menu Template 1/2") // Title of the GUI
        form.body("Created by LVRAID3RS#4808") // Body Text Of the GUI
        form.button(`Button1 `) // Button 1 Text
        form.button("Button2") // Button 2 Text
        form.button("Button3") // Button 3 Text


        form.show(player).then((response) => {
        if (response.selection === 0) {
            player.runCommand(`function admin/spawn`);  // Runs A command on the player
    }
        if (response.selection === 1) {
            console.warn("Clicked Button 2") // Sends a Console warn to the player
    }
    if(response.selection == 2) return page2(player) // Returns a Second Page to a Player
        })
    }

// Page 2

function page2(player) {
    let temp = new MessageFormData()
        temp.title("GUI Menu Template 2/2")
        temp.body("Created by LVRAID3RS#4808")
        temp.button1(`Confirm`) // Unforunately 'MessageFormData' Can only have 2 button i Suggest using 'ActionFormData'
        temp.button2(`Cancel`) // Cancels out the UI

        
        temp.show(player).then((response) => {  
            if (response.selection === 1) { // ActionFormData GUI's start from 0 While Messageformdata starts at 1
                player.runCommand(`say Pressed Confirm Button`);
            }
        })
    }