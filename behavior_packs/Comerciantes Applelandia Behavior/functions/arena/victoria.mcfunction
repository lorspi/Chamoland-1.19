execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ give @p appleplus:pila_moneda
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ give @p thelake:lucky_block
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ xp 400 @p
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ title @p title §a§l¡FELICIDADES POR TU VICTORIA!
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ tellraw @a {"rawtext":[{"text":"   "}]}
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ tellraw @a {"rawtext":[{"text":"§a§l¡VICTORIA EN LA ARENA!"}]}
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ tellraw @a {"rawtext":[{"text":"   "}]}
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ playsound random.levelup @a
execute @e[name=Puntos,scores={NivelArena=4}] ~ ~ ~ playsound random.levelup @a 2082 82 -2931
tp @p ~46 ~6 ~