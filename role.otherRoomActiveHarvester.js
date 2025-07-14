var roleHarvester = {
    run:function(creep){
        var sources = creep.room.find(FIND_SOURCES);
        var harvestRoom = creep.memory.chosenRoom;
        //change creep memory based on creep energy storage
        if (creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.harvesting = true;
        }
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            creep.memory.harvesting = false;
        }
        //harvesting logic
        console.log(harvestRoom);
        if (creep.memory.harvesting){
            if (creep.room.name != harvestRoom){
                console.log(creep.moveTo(Game.rooms[harvestRoom]));
            }
            else {
                if (creep.moveTo(sources[creep.memory.chosenSource]) == ERR_NO_PATH || sources[creep.memory.chosenSource].energy == 0) {
                    creep.memory.chosenSource += 1;
                    if (creep.memory.chosenSource >= sources.length) {
                        creep.memory.chosenSource = 0;
                    }
                }
            }
        }
        else {
            //Change this room to the room you want to supply
            var targetsStorage = Game.rooms['E22S36'].storage;
            if(creep.transfer(targetsStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetsStorage);
            }
        }
    }
}

module.exports = roleHarvester;