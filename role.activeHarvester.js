var roleHarvester = {
    run:function(creep){
        let sources = creep.room.getSources();
        
        //change creep memory based on creep energy storage
        if (creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.harvesting = true;
        }
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            creep.memory.harvesting = false;
        }
        //harvesting logic
        if (creep.room.name == creep.memory.homeRoom) {
            if (creep.memory.harvesting){
                if (creep.moveTo(sources[creep.memory.chosenSource]) == ERR_NO_PATH || sources[creep.memory.chosenSource].energy == 0) {
                    creep.memory.chosenSource += 1;
                    if (creep.memory.chosenSource >= sources.length) {
                        creep.memory.chosenSource = 0;
                    }
                }
                else {
                    if (creep.harvest(sources[creep.memory.chosenSource]) == ERR_NOT_IN_RANGE){
                        creep.moveTo(sources[creep.memory.chosenSource]);
                    }
                }
            }
            else {
                var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });
                if (targets && creep.room.energyAvailable < creep.room.energyCapacityAvailable){
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
                else {
                    creep.moveTo(Game.flags['Idle.'+creep.memory.homeRoom]);
                }
            }
        }
        else {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.homeRoom));
        }
    }
}

module.exports = roleHarvester;