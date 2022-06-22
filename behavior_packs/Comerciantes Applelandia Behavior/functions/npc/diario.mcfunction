scoreboard objectives add RegaloDiario dummy
scoreboard objectives add TotalDiario dummy

execute @p[scores={RegaloDiario=0}] ~ ~ ~ give @s appleplus:moneda 3
execute @p[scores={RegaloDiario=0}] ~ ~ ~ give @s venezuela:arepa
execute @p[scores={RegaloDiario=0}] ~ ~ ~ give @s venezuela:frescolita
execute @p[scores={RegaloDiario=0}] ~ ~ ~ playsound random.levelup @s
execute @p[scores={RegaloDiario=0}] ~ ~ ~ title @s actionbar §l§a¡Recibiste tu regalo diario!

execute @p[scores={RegaloDiario=1}] ~ ~ ~ playsound note.pling @s
execute @p[scores={RegaloDiario=1}] ~ ~ ~ title @s actionbar §l§4Ya has reclamado tu regalo de hoy

scoreboard players set @p RegaloDiario 1
scoreboard players add @p TotalDiario 1