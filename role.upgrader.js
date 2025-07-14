var roleUpgrader = {
    run:function(creep){
        var logicHarvest = require('logic.harvest');
        
        if (creep.room.name == creep.memory.homeRoom) {
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
            //Upgrading Logic
            else {
                if (creep.upgradeController(creep.room.controller)==ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        else {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.homeRoom));
        }
    }
}

module.exports = roleUpgrader;