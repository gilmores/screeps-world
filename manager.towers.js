var managerTowers = {
run:function(room) {
    const desiredWallRampartHP = 100000;
    const percentEnergyNeededToRepairStructure = 0.66;
    const percentEnergyNeededToRepairWallRampart = 0.90;
    let towers = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER)
        }
    });
    //Tower control
    if (towers.length) {
        for (let i = 0; i < towers.length; i++) {
            let closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            let structureTargets = towers[i].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) &&
                    structure.hits < structure.hitsMax;
                }
            });
            let rampartTargets = towers[i].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType == STRUCTURE_RAMPART) &&
                    structure.hits < desiredWallRampartHP;
                }
            });
            let wallTargets = towers[i].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType == STRUCTURE_WALL) &&
                    structure.hits < desiredWallRampartHP;
                }
            });
            // Old but funny comment: defining the grouped variable by concatinating because filters still confuse the he** out of me
            let wallsRampartsTargets = rampartTargets.concat(wallTargets);
            // let weakestWall = 

            if (closestHostile) {
                //Add code so the tower won't get intentionally drained, maybe a 3 tick delay until attacking
                towers[i].attack(closestHostile);
            }
            else if (structureTargets.length 
                    && towers[i].store[RESOURCE_ENERGY] > towers[i].store.getCapacity(RESOURCE_ENERGY) * percentEnergyNeededToRepairStructure) {
                if (structureTargets[0].hits < structureTargets[0].hitsMax) {
                    towers[i].repair(structureTargets[0]);
                }
            }
            else if (wallsRampartsTargets.length 
                    && towers[i].store[RESOURCE_ENERGY] > towers[i].store.getCapacity(RESOURCE_ENERGY) * percentEnergyNeededToRepairWallRampart) {
                let weakestWallsRampartsTarget = wallsRampartsTargets[0];
                for (const i in wallsRampartsTargets) {
                    if (weakestWallsRampartsTarget.hits > wallsRampartsTargets[i].hits) {
                        weakestWallsRampartsTarget = wallsRampartsTargets[i];
                    }
                }
                if (weakestWallsRampartsTarget.hits < desiredWallRampartHP) {
                    towers[i].repair(weakestWallsRampartsTarget);
                }
            }
        }
    }
}
}
module.exports = managerTowers;