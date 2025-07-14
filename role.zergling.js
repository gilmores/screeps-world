let roleZergling = {
    run:function(creep) {
        //Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE],'Dennis',{memory: {role:'zergling'}})
        const attackCon = true;
        const followDistance = 2;
        let zerglings = _.filter(Game.creeps, function (c) {return c.memory.role == "zergling"});
        
        const flag = Game.flags.A;
        function getReplaceSquadLeader() {
            for (let name in zerglings) {
                if (zerglings[name].memory.squadLeader && zerglings[name].memory.squadLeader == zerglings[name].name) {
                    creep.memory.squadLeader = zerglings[name].name;
                    break;
                }
            }
            if (!creep.memory.squadLeader) {
                creep.memory.squadLeader = creep.name;
                creep.say("New Leader");
            }
        }

        function moveToAttackTarget(target) {
            if (target) {
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }

        if (creep.memory.squadLeader) {
            if (!Game.creeps[creep.memory.squadLeader]) {
                creep.memory.squadLeader = null;
                getReplaceSquadLeader();
            }
        }
        else {
            getReplaceSquadLeader();
        }
        let isSquadLeader = creep.memory.squadLeader == creep.name;
        
        if (isSquadLeader) {
            let target = creep.memory.target;
            let closestCreepTarget = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            let dangerousCreepTargets = creep.room.find(FIND_HOSTILE_CREEPS, {
                filter: (enemyCreep) => {
                    return (enemyCreep.body.some(part => 
                        part.type == 'ATTACK' 
                        || part.type == 'RANGED_ATTACK'
                        || part.type == 'HEAL'
                        || part.type == 'CLAIM'));
                }
            });
            let closestDangerousCreepTarget = creep.pos.findClosestByPath(dangerousCreepTargets);
            let closestStructureTarget = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType != STRUCTURE_CONTROLLER
                        && structure.structureType != STRUCTURE_ROAD
                        && structure.structureType != STRUCTURE_RAMPART
                        && structure.structureType != STRUCTURE_WALL
                        /*&& structure.structureType != STRUCTURE_SPAWN*/);
                }
            });
            let closestTowerTarget = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType == STRUCTURE_TOWER);
                }
            });
            let ramparts = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType == STRUCTURE_RAMPART);
                }
            });
            let walls = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) => {
                    return(structure.structureType == STRUCTURE_WALL);
                }
            });
            let thereIsTarget = (closestCreepTarget || closestStructureTarget);
            if (thereIsTarget) {
                if (closestDangerousCreepTarget) target = closestDangerousCreepTarget;
                else if (closestTowerTarget) target = closestTowerTarget;
                else if (closestCreepTarget) target = closestCreepTarget;
                else if (closestStructureTarget) target = closestStructureTarget;
                else target = null;
                creep.memory.target = target;
                moveToAttackTarget(target);
            }
            else if (flag) {
                /*if (creep.pos.roomName != flag.pos.roomName)*/ creep.moveTo(flag, {visualizePathStyle: {}});
                creep.memory.target = null;
            }
            else {
                creep.memory.target = null;
            }
        }
        else {
            let squadLeader = Game.creeps[creep.memory.squadLeader];
            creep.memory.target = squadLeader.memory.target;
            let target = creep.memory.target;
            if (target) {
                moveToAttackTarget(target);
            }
            else if (!creep.pos.inRangeTo(squadLeader.pos, followDistance)) {
                creep.moveTo(squadLeader.pos);
            }
        }
    }
};
module.exports = roleZergling;