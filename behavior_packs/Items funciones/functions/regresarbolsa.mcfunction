#execute @e[type=if:bolsa_entidad] ~ ~ ~ testfor @p[r=8]
# Bloque de comando con inversor de señal.
# function regresarbolsa

#title @p actionbar §aVasija mágica regresada.
#playsound mob.endermen.portal @p
#particle minecraft:totem_particle ~ ~1 ~
particle minecraft:egg_destroy_emitter ~ ~1 ~
tp @e[type=if:bolsa_entidad] @e[type=hovertext:warp,name=rtdfgh]