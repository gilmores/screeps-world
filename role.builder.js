var roleBuilder = {
    run:function(creep) {
        const logicHarvest = require('logic.harvest');
        let targets = creep.room.getConstructionSites();
        if (creep.room.name == creep.memory.homeRoom) {
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.harvesting = true;
            }
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.harvesting = false;
            }
            //harvesting logic
            if (creep.memory.harvesting) {
                logicHarvest.run(creep);
            }
            //Building Logic
            else if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                // creep.moveTo(Game.flags['Idle.' + creep.memory.homeRoom]);
                creep.memory.role = "upgrader";
            }
        }
        else {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.homeRoom));
        }
    }
}
module.exports = roleBuilder;