execute @e[name=Puntos,scores={NivelArena=3}] ~ ~ ~ title @p subtitle §7§oDirígete a la salida para recibir tus premios.
execute @e[name=Puntos,scores={NivelArena=3}] ~ ~ ~ title @p title §2¡Has terminado!
execute @e[name=Puntos,scores={NivelArena=3}] ~ ~ ~ scoreboard players add @e[name=Puntos] NivelArena 1

execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ give @p appleplus:moneda 3
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ xp 150 @p
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ effect @p instant_health 5
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ title @p title §4§l¡RONDA 3!
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ playsound mob.wither.spawn @p
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ summon zombie §4Esbirro 2049 82 -2939
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ summon zombie §4Esbirro 2043 82 -2924
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ summon zombie §4Esbirro 2056 85 -2919
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ summon zombie §4Esbirro 2058 82 -2939
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ summon zombie §4Esbirro 2041 82 -2947
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ scoreboard players add @e[name=Puntos] NivelArena 1

execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ give @p appleplus:moneda
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ xp 50 @p
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ effect @p instant_health 5
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ title @p title §4§l¡RONDA 2!
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ playsound mob.wither.spawn @p
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ summon zombie §4Esbirro 2064 82 -2944
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ summon zombie §4Esbirro 2064 82 -2919
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ summon zombie §4Esbirro 2039 82 -2919
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ summon zombie §4Esbirro 2041 82 -2947
execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ scoreboard players add @e[name=Puntos] NivelArena 1

* FINAL
* Fuegos artificiales