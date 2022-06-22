scoreboard objectives add UsosNPC dummy
scoreboard players add @p UsosNPC 1

scoreboard objectives add RegaloInicial dummy
scoreboard objectives add TotalInicial dummy

scoreboard players add @p RegaloInicial 0
scoreboard players add @p TotalInicial 0

scoreboard objectives add TotalXP dummy
scoreboard players add @p TotalXP 0
scoreboard objectives add PagarXP dummy
scoreboard players set @p PagarXP 0
execute @p[lm=15] ~ ~ ~ scoreboard players set @s PagarXP 1