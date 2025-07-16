var roleTransferer = {
    run:function(creep){
        let targetsStorage = creep.room.storage;
        //define structures that have or need energy
        //containers are any container that has at least half of the creep's storage capacity
        let roomSpawns = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN
                && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
            }
        });
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER
                && structure.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY) / 2;
            }
        });
        let towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER
                && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY) - (structure.store.getCapacity(RESOURCE_ENERGY) / 20);
            }
        });
        let extensions = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION
                && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
            }
        });
        let chosenExtension = creep.pos.findClosestByPath(extensions);
        let chosenTower = creep.pos.findClosestByPath(towers);
        let droppedResources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        let containerHarvesters = _.filter(Game.creeps, (other) => other.memory.role == 'containerHarvester' && other.memory.homeRoom == creep.memory.homeRoom);
        //transfer logic
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.draining = true;
        }
        if (creep.store.getUsedCapacity() == creep.store.getCapacity() && (chosenExtension || chosenTower || roomSpawns)) {
            creep.memory.draining = false;
        }
        if (creep.memory.draining && creep.ticksToLive > 40 && (droppedResources || containers.length || targetsStorage)) {
            if (droppedResources && droppedResources.amount > creep.store.getCapacity() / 3) {
                if (creep.pickup(droppedResources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources);
                }
            }
            else if (containers.length) {
                if (droppedResources) creep.pickup(droppedResources);
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0].pos);
                }
            }
            else if (targetsStorage) {
                if (creep.withdraw(targetsStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetsStorage);
                }
            }
        }
        else {
            if (roomSpawns[0] && roomSpawns[0].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.transfer(roomSpawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(roomSpawns[0]);
                }
            }
            else if (extensions.length && chosenExtension.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.transfer(chosenExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(chosenExtension);
                }
            }
            else if (towers.length && chosenTower.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(towers[0]);
                }
            }
            else if (targetsStorage && targetsStorage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (targetsStorage.store[RESOURCE_ENERGY] < targetsStorage.store.getCapacity(RESOURCE_ENERGY)) {
                    if (creep.transfer(targetsStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetsStorage);
                    }
                }
            }
            else {
                if (creep.store.getUsedCapacity() > 0) {
                    creep.memory.draining = false;
                }
                else {
                    creep.memory.draining = true;
                }
                creep.moveTo(Game.flags['Idle.' + creep.memory.homeRoom]);
            }
        }
    }
}
module.exports = roleTransferer;