import { BlockLocation } from 'mojang-minecraft';
import { PRINT_TO_ACTION_BAR } from '../config.js';
import { Server, RawText } from './../library/Minecraft.js';
/**
 * Sends a message to a player through either chat or the action bar.
 * @param msg The message to send
 * @param player The one to send the message to
 * @param toActionBar If true the message goes to the player's action bar; otherwise it goes to chat
 */
export function print(msg, player, toActionBar = false) {
    if (typeof msg == 'string') {
        msg = RawText.translate(msg);
    }
    let command;
    if (toActionBar && PRINT_TO_ACTION_BAR) {
        command = `titleraw @s actionbar ${msg.toString()}`;
    }
    else {
        command = `tellraw @s ${msg.toString()}`;
    }
    Server.runCommand(command, player);
}
/**
 * Acts just like {print} but also prepends '§c' to make the message appear red.
 * @see {print}
 */
export function printerr(msg, player, toActionBar = false) {
    if (!(msg instanceof RawText)) {
        msg = RawText.translate(msg);
    }
    print(msg.prepend('text', '§c'), player, toActionBar);
}
const worldY = new Map([
    ['minecraft:overworld', [-64, 319]],
    ['minecraft:nether', [0, 127]],
    ['minecraft:the_end', [0, 255]],
    ['', [0, 0]]
]);
/**
 * Gets the minimum Y level of the dimension a player is in.
 * @param player The player whose dimension we're testing
 * @return The minimum Y level of the dimension the player is in
 */
export function getWorldMinY(player) {
    return worldY.get(player.dimension.id)[0];
}
/**
 * Gets the maximum Y level of the dimension a player is in.
 * @param player The player whose dimension we're testing
 * @return The maximum Y level of the dimension the player is in
 */
export function getWorldMaxY(player) {
    return worldY.get(player.dimension.id)[1];
}
/**
 * Tests if a block can be placed in a certain location of a dimension.
 * @param loc The location we are testing
 * @param dim The dimension we are testing in
 * @return Whether a block can be placed
 */
export function canPlaceBlock(loc, dim) {
    const locString = printLocation(loc, false);
    let error = Server.runCommand(`structure save canPlaceHere ${locString} ${locString} false memory`, dim).error;
    if (!error) {
        error = Server.runCommand(`structure load canPlaceHere ${locString}`, dim).error;
        Server.runCommand(`structure delete canPlaceHere ${locString}`, dim);
    }
    return !error;
}
/**
 * Converts a location object to a string.
 * @param loc The object to convert
 * @param pretty Whether the function should include brackets and commas in the string. Set to false if you're using this in a command.
 * @return A string representation of the location
 */
export function printLocation(loc, pretty = true) {
    if (pretty)
        return `(${loc.x}, ${loc.y}, ${loc.z})`;
    else
        return `${loc.x} ${loc.y} ${loc.z}`;
}
/**
 * Converts loc to a string
 */
export function locToString(loc) {
    return `${loc.x}_${loc.y}_${loc.z}`;
}
/**
 * Converts string to a BlockLocation
 */
export function stringToLoc(loc) {
    return new BlockLocation(...loc.split('_').map(str => Number.parseInt(str)));
}
