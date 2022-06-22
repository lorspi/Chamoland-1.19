#testfor @e[type=item,name="Volver a la aldea"]
execute @e[type=item,name="Volver a la aldea"] ~ ~ ~ playsound portal.trigger @p[r=2]
execute @e[type=item,name="Volver a la aldea"] ~ ~ ~ give @p[r=2] appleplus:aldea
execute @e[type=item,name="Volver a la aldea"] ~ ~ ~ tp @p[r=2] @e[type=hovertext:warp,name=kzjopw]
kill @e[type=item,name="Volver a la aldea"]


#testfor @e[type=item,name="Volver a casa"]
execute @e[type=item,name="Volver a casa"] ~ ~ ~ playsound portal.trigger @p[r=2]
execute @e[type=item,name="Volver a casa"] ~ ~ ~ give @p[r=2] appleplus:casa
execute @e[type=item,name="Volver a casa"] ~ ~ ~ tp @p[r=2] @e[type=hovertext:warp,name=ecjseq]
kill @e[type=item,name="Volver a casa"]