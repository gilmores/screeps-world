var roleRepairer = {
    run:function(creep){
        var targets = creep.room.find(FIND_STRUCTURES);
        var logicHarvest = require('logic.harvest');
        
        //change creep memory based on creep energy storage
        if (creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.harvesting = true;
        }
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            creep.memory.harvesting = false;
        }
        //harvesting logic
        if (creep.memory.harvesting){
            logicHarvest.run(creep);
        }
        //Repairing Logic
        else {
            if (targets.length) {
                // this is dogshit change it cause it sucks nuts
                for (var i = 0; i < targets.length; i++) {
                    if (targets[i].hits < 30000) {
                        if (targets[i].hits < targets[i].hitsMax) {
                            if (creep.repair(targets[i]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[i]);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
module.exports = roleRepairer;