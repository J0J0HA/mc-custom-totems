execute as @e if items entity @s weapon.offhand totem_of_undying[!minecraft:custom_data~{"customtotems:owned":1b}] run function customtotems:own
execute as @e if score @s disown matches 1.. run function customtotems:disown
execute as @e if score @s disown matches 1.. run scoreboard players set @s disown 0
scoreboard players enable @a disown
