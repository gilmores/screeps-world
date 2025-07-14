var roleDestroyer = {
    run:function(creep){
        //Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],'Dennis',{memory: {role:'destroyer'}})
        var creepTarget = null;//creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS); //there is some difference between FIND_HOSTILE_CREEPS and FIND_HOSTILE_STRUCTURES that makes them inexchangeable
        var structureTarget = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return(structure.structureType != STRUCTURE_CONTROLLER
                    && structure.structureType != STRUCTURE_ROAD
                    && structure.structureType != STRUCTURE_RAMPART
                    && structure.structureType != STRUCTURE_WALL
                    && structure.structureType != STRUCTURE_SPAWN);
            }
        });
        var ramparts = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return(structure.structureType == STRUCTURE_RAMPART);
            }
        });
        var walls = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return(structure.structureType == STRUCTURE_WALL);
            }
        });
        //defining the grouped variable by concatinating because filters still confuse the hell out of me
        //var wallsRampartsTarget = ramparts.concat(walls);
        var flag = Game.flags.Attack;
        if (flag){
            if(creep.pos.roomName==flag.pos.roomName){
                if (creepTarget) {
                    console.log("Destroyer " + creep.name + " targeting enemy creep");
                    if (creep.attack(creepTarget)==ERR_NOT_IN_RANGE) {
                        if (creep.moveTo(creepTarget, {visualizePathStyle: {}})==ERR_NO_PATH){
                            if (creep.attack(wallsRampartsTarget, {visualizePathStyle: {}})==ERR_NOT_IN_RANGE) {
                                creep.moveTo(wallsRampartsTarget, {visualizePathStyle: {}});
                            }
                        }
                    }
                }
                else if (structureTarget) {
                    console.log("Destroyer " + creep.name + " targeting enemy structure");
                    if (creep.attack(structureTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureTarget, {visualizePathStyle: {}});
                    }
                }
                else {
                    creep.moveTo(flag, {visualizePathStyle: {}});
                    console.log("Destroyer " + creep.name + " moving to flag");
                    creep.say("🤡", true);
                }
            }
            else {
                creep.moveTo(flag, {visualizePathStyle: {}});
                console.log("Destroyer " + creep.name + " moving to flag");
            }
        }
    }
};
module.exports = roleDestroyer;