import { Server } from './../../library/Minecraft.js';
import { getSession } from '../sessions.js';
class ToolBuilder {
    constructor() {
        this.tools = new Map();
        this.bindings = new Map();
        this.fixedBindings = new Map();
        this.disabled = [];
        this.currentTick = 0;
        Server.on('beforeItemUse', ev => {
            if (ev.source.id != 'minecraft:player' || !ev.item) {
                return;
            }
            this.onItemUse(ev.item, ev.source, ev);
        });
        Server.on('beforeItemUseOn', ev => {
            if (ev.source.id != 'minecraft:player' || !ev.item) {
                return;
            }
            this.onItemUse(ev.item, ev.source, ev, ev.blockLocation);
        });
        Server.on('tick', ev => {
            this.currentTick = ev.currentTick;
        });
    }
    register(toolClass, name, item) {
        this.tools.set(name, toolClass);
        if (item) {
            this.fixedBindings.set(item + '/0', new (toolClass)());
        }
    }
    bind(toolId, itemId, itemData, player, ...args) {
        this.unbind(itemId, itemData, player);
        if (itemId) {
            const tool = new (this.tools.get(toolId))(...args);
            tool.type = toolId;
            this.createPlayerBindingMap(player);
            this.bindings.get(player.name).set(`${itemId}/${itemData}`, tool);
            return tool;
        }
        else {
            throw 'worldedit.tool.noItem';
        }
    }
    unbind(itemId, itemData, player) {
        if (itemId) {
            if (this.fixedBindings.has(itemId + '/0')) {
                throw 'worldedit.tool.fixedBind';
            }
            this.createPlayerBindingMap(player);
            this.bindings.get(player.name).delete(`${itemId}/${itemData}`);
        }
        else {
            throw 'worldedit.tool.noItem';
        }
    }
    deleteBindings(player) {
        this.bindings.delete(player.name);
        this.setDisabled(player, false);
    }
    hasBinding(itemId, itemData, player) {
        if (itemId) {
            return this.bindings.get(player.name)?.has(`${itemId}/${itemData}`) || this.fixedBindings.has(itemId + '/0');
        }
        else {
            return false;
        }
    }
    getBoundItems(player, type) {
        const tools = this.bindings.get(player.name);
        return tools ? Array.from(tools.entries())
            .filter(binding => !type || (typeof type == 'string' ? binding[1].type == type : type.test(binding[1].type)))
            .map(binding => [binding[0].split('/')[0], parseInt(binding[0].split('/')[1])])
            : [];
    }
    setProperty(itemId, itemData, player, prop, value) {
        if (itemId) {
            const tool = this.bindings.get(player.name).get(`${itemId}/${itemData}`);
            if (tool && prop in tool) {
                tool[prop] = value;
                return true;
            }
        }
        return false;
    }
    hasProperty(itemId, itemData, player, prop) {
        if (itemId) {
            const tool = this.bindings.get(player.name).get(`${itemId}/${itemData}`);
            if (tool && prop in tool) {
                return true;
            }
        }
        return false;
    }
    setDisabled(player, disabled) {
        if (disabled && !this.disabled.includes(player.name)) {
            this.disabled.push(player.name);
        }
        else if (!disabled && this.disabled.includes(player.name)) {
            this.disabled.splice(this.disabled.indexOf(player.name), 1);
        }
    }
    onItemUse(item, player, ev, loc) {
        if (this.disabled.includes(player.name)) {
            return;
        }
        const key = `${item.id}/${item.data}`;
        let tool;
        if (this.bindings.get(player.name)?.has(key)) {
            tool = this.bindings.get(player.name).get(key);
        }
        else if (this.fixedBindings.has(key)) {
            tool = this.fixedBindings.get(key);
        }
        else {
            return;
        }
        tool.process(getSession(player), this.currentTick, loc);
        ev.cancel = true;
    }
    createPlayerBindingMap(player) {
        if (!this.bindings.has(player.name)) {
            this.bindings.set(player.name, new Map());
        }
    }
}
export const Tools = new ToolBuilder();
