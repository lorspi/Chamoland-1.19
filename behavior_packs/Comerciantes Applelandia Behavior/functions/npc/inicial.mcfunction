scoreboard objectives add RegaloInicial dummy
scoreboard objectives add TotalInicial dummy

execute @p[scores={RegaloInicial=0}] ~ ~ ~ give @s thelake:lucky_block_vene
execute @p[scores={RegaloInicial=0}] ~ ~ ~ playsound random.levelup @s
execute @p[scores={RegaloInicial=0}] ~ ~ ~ title @s actionbar §l§a¡Recibiste tu kit de inicio!

execute @p[scores={RegaloInicial=1}] ~ ~ ~ playsound note.pling @s
execute @p[scores={RegaloInicial=1}] ~ ~ ~ title @s actionbar §l§4Ya has reclamado tu kit de inicio

scoreboard players set @p RegaloInicial 1
scoreboard players add @p TotalInicial 1