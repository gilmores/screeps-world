var logicHarvest = {
    run:function(creep){
        let sources = creep.room.getSources();
        let possibleContainers = creep.room.getContainers();
        let targetsStorage = creep.room.storage;
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                structure.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY);
            }
        });
        let roomContainerHarvesters = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return(creep.memory.role == 'containerHarvester')}
        });
        if (possibleContainers.length >= sources.length && roomContainerHarvesters.length > 0) {
            creep.memory.harvestMode = 'container';
        }
        else {
            creep.memory.harvestMode = 'active';
        }
        if (creep.memory.harvestMode == 'active'){
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
        else if (creep.memory.harvestMode == 'container') {
            let preferContainer = true;
            if (targetsStorage) {
                preferContainer = false;
            }
            if (containers.length && preferContainer) {
                let closestContainer = creep.pos.findClosestByPath(containers);
                if (creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestContainer);
                }
            }
            else if (targetsStorage && targetsStorage.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)) {
                if (creep.withdraw(targetsStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetsStorage);
                }
            }
            else if (containers.length) {
                let closestContainer = creep.pos.findClosestByPath(containers);
                if (creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestContainer);
                }
            }
            else {
                creep.moveTo(Game.flags['Idle.'+creep.memory.homeRoom]);
            }
        }
    }
}
module.exports = logicHarvest;