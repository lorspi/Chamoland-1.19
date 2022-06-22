scoreboard objectives add PagarXP dummy
scoreboard objectives add TotalXP dummy

execute @p[scores={PagarXP=0}] ~ ~ ~ playsound note.pling @s
execute @p[scores={PagarXP=0}] ~ ~ ~ title @s actionbar §l§4No has trabajado lo suficiente.

execute @p[scores={PagarXP=1}] ~ ~ ~ give @s appleplus:moneda 5
execute @p[scores={PagarXP=1}] ~ ~ ~ playsound random.levelup @s
execute @p[scores={PagarXP=1}] ~ ~ ~ title @s actionbar §l§a¡Buen trabajo! Toma tu pago.
execute @p[scores={PagarXP=1}] ~ ~ ~ xp -15l @s

scoreboard players set @p PagarXP 0
scoreboard players add @p TotalXP 1