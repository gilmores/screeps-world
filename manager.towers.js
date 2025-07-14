var managerTowers = {
run:function(room) {
    let desiredWallRampartHP = 150000;
    let towers = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER)
        }
    });
    //Tower control
    if (towers.length) {
        for (let i = 0; i < towers.length; i++){
            let closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            let targets = towers[i].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) &&
                    structure.hits < structure.hitsMax;
                }
            });
            
            let ramparts = towers[i].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType == STRUCTURE_RAMPART) &&
                    structure.hits < desiredWallRampartHP;
                }
            });
            let walls = towers[i].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType == STRUCTURE_WALL) &&
                    structure.hits < desiredWallRampartHP;
                }
            });
            //defining the grouped variable by concatinating because filters still confuse the hell out of me
            let wallsRamparts = ramparts.concat(walls);

            if (closestHostile) {
                //Add code so the tower won't get intentionally drained, maybe a 3 tick delay until attacking
                towers[i].attack(closestHostile);
            }
            else if (targets.length && towers[i].store[RESOURCE_ENERGY] > towers[i].store.getCapacity(RESOURCE_ENERGY) / 1.5) {
                if (targets[0].hits < targets[0].hitsMax) {
                    towers[i].repair(targets[0]);
                }
            }
            else if (wallsRamparts.length && towers[i].store[RESOURCE_ENERGY] > towers[i].store.getCapacity(RESOURCE_ENERGY) / 1.25) {
                let weakestWallsRamparts = wallsRamparts[0];
                for (const i in wallsRamparts) {
                    if (weakestWallsRamparts.hits > wallsRamparts[i].hits) {
                        weakestWallsRamparts = wallsRamparts[i];
                    }
                }
                if (weakestWallsRamparts.hits < desiredWallRampartHP) {
                    towers[i].repair(weakestWallsRamparts);
                }
            }
        }
    }
}
}
module.exports = managerTowers;