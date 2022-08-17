import { world } from "mojang-minecraft";

world.events.tick.subscribe(() => {
    let players = Array.from(world.getPlayers());
    try {
        players[0].runCommand(`execute @s[hasitem={item=totem_of_undying,location=slot.weapon.offhand}] ~ ~ ~ function luz/light`);
    } catch (err) {
        players[0].runCommand(`execute @s ~ ~ ~ function luz/lightnt`);
    }
});


world.events.tick.subscribe(() => {
    let players = Array.from(world.getPlayers());

    for (let p of players) {
        let container = p.getComponent("inventory").container;
        let hand = container.getItem(p.selectedSlot);

        if (hand.id == "minecraft:totem_of_undying") {
            try {
                p.runCommand(`execute @s[hasitem={item=totem_of_undying,location=slot.weapon.mainhand}] ~ ~ ~ function luz/light`);
            } catch (err) {
                p.runCommand(`execute @s ~ ~ ~ function luz/lightnt`);
            }
        }
    }
});

world.events.tick.subscribe(() => {
    let players = Array.from(world.getPlayers());

    for (let p of players) {
        let container = p.getComponent("inventory").container;
        let hand = container.getItem(p.selectedSlot);

        if (hand.id == "minecraft:torch") {
            try {
                p.runCommand(`execute @s[hasitem={item=torch,location=slot.weapon.mainhand}] ~ ~ ~ function luz/light`);
            } catch (err) {
                p.runCommand(`execute @s ~ ~ ~ function luz/lightnt`);
            }
        }
    }
});