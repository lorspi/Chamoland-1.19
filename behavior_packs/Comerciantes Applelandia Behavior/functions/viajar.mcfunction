effect @p slowness 3 6 false
title @p actionbar §aMantén pulsado para viajar...
effect @s blindness 4
particle minecraft:totem_particle ~ ~1 ~
particle minecraft:egg_destroy_emitter ~ ~1 ~
scoreboard objectives add DelayViaje dummy
scoreboard players add @p DelayViaje 1
scoreboard objectives add UsosVara dummy
execute @p[scores={DelayViaje=20}] ~ ~ ~ replaceitem entity @s slot.weapon.mainhand 1 air
execute @p[scores={DelayViaje=20}] ~ ~ ~ playsound portal.travel @s ~ ~ ~ 0.1
execute @p[scores={DelayViaje=20}] ~ ~ ~ tp @s @e[type=hovertext:warp,name=kzjopw]
execute @p[scores={DelayViaje=20}] ~ ~ ~ particle minecraft:totem_particle ~ ~1 ~
execute @p[scores={DelayViaje=20}] ~ ~ ~ particle minecraft:egg_destroy_emitter ~ ~1 ~
scoreboard players add @p[scores={DelayViaje=16}] UsosVara 1
scoreboard players set @p[scores={DelayViaje=20}] DelayViaje 0