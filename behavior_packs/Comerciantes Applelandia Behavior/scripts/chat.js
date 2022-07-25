import { world } from "mojang-minecraft"

function chatrank(data){
    const tags = data.sender.getTags()    
    let ranks = [];
    for(const tag of tags){
        if(tag.startsWith('rank:')){
            ranks.push(tag.replace('rank:', ''))
        }
    }
    if(ranks.length == 0)ranks = ["§a"]
    
    if(data.message.startsWith("!")){
        data.cancel = true
        return
    }
    let text = `${ranks}${data.sender.nameTag}: §r§f${data.message}`
    world.getDimension('overworld').runCommand(`tellraw @a {"rawtext":[{"translate":${JSON.stringify(text)}}]}`)
    data.cancel = true
}
export { chatrank }