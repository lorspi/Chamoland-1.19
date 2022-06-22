execute @e[name=Puntos,scores={NivelArena=1}] ~ ~ ~ tellraw @a {"rawtext":[{"text":"§4§lAlguien fracasó en el nivel 1 de la arena."}]}
execute @e[name=Puntos,scores={NivelArena=2}] ~ ~ ~ tellraw @a {"rawtext":[{"text":"§4§lAlguien fracasó en el nivel 2 de la arena."}]}
execute @e[name=Puntos,scores={NivelArena=3}] ~ ~ ~ tellraw @a {"rawtext":[{"text":"§4§lAlguien fracasó en el nivel 3 de la arena."}]}
kill @e[name="§4Esbirro",r=40]

scoreboard players set @e[name=Puntos] NivelArena 0








