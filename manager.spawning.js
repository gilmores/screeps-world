var managerSpawning = {
run:function(room, desiredCreeps) {
    
    //decide harvest mode, active or container
    let mainHarvestMode = 'container';

    //Collect each category of buildings
    let extensions = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION}
    });
    //Define creeps per room
    let roomCreeps = room.find(FIND_MY_CREEPS);
    //Define Spawns
    let roomSpawns = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return(structure.structureType == STRUCTURE_SPAWN);}
    });
    let containers = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER)
        }
    });
    let roomTombstones = room.find(FIND_TOMBSTONES); //Spawn a creep if there's a tombstone
    
    let roomActiveHarvesters = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'activeHarvester')}
    });
    let roomContainerHarvesters = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'containerHarvester')}
    });
    let roomUpgraders = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'upgrader')}
    });
    let roomTransporters = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'transporter')}
    });
    let roomBuilders = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'builder')}
    });
    let roomRepairers = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'repairer')}
    });
    let roomTransferers = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'transferer')}
    });
    let roomOtherRoomActiveHarvesters = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'otherRoomActiveHarvester')}
    });
    let roomDestroyers = room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return(creep.memory.role == 'destroyer')}
    });
    if (roomSpawns.length && !roomSpawns[0].spawning) {
        //If only have a spawn and < 2 extensions, spawn like this:
        if (extensions.length < 2 || roomCreeps.length < 1){
            if (roomSpawns[0].room.energyAvailable >= 300){
                if (roomActiveHarvesters.length < 2){
                    roomSpawns[0].spawnCreep([MOVE,MOVE,CARRY,CARRY,WORK], 'Active Harvester ' + Math.floor(Math.random() * 100000), {memory: {role:'activeHarvester',chosenSource:0,homeRoom:room.name}});
                }
                else if (roomUpgraders.length < 1){
                    roomSpawns[0].spawnCreep([MOVE,MOVE,CARRY,CARRY,WORK], 'Upgrader ' + Math.floor(Math.random() * 100000), {memory: {role:'upgrader',chosenSource:0,harvestMode:'active',homeRoom:room.name}});
                }
                //change this spawn to spawn creeps proportional to how many buildings need to be built
                else if (roomSpawns[0].room.find(FIND_CONSTRUCTION_SITES).length > 1 && roomBuilders.length < 2){
                    roomSpawns[0].spawnCreep([MOVE,MOVE,CARRY,CARRY,WORK], 'Builder ' + Math.floor(Math.random() * 100000), {memory: {role:'builder',chosenSource:0,harvestMode:'active',homeRoom:room.name}});
                }
            }
        }
        //spawning once there are extensions
        else {
            //A container Harvester will need at least 5 work modules to drain the energy efficiently, 3000 energy per 300 ticks, each work module takes 2 energy/tick
            //create worker body based on how much energy capacity there is in the room
            //For the future, make the creep body definitions a function so they only run when the creep is spawning, and return then final body
            const workerBody = [MOVE,CARRY,WORK]
            const workerBodyCost = 200;
            let numWorkerBody = Math.floor(roomSpawns[0].room.energyCapacityAvailable / (1 * workerBodyCost));
            let finalWorkerBody = [];
            for (let i = 0; i < numWorkerBody; i++) {
                //Here i used concat over push, because push would add on MOVE,CARRY,WORK as a single list item instead of three individual ones
                finalWorkerBody = finalWorkerBody.concat(workerBody);
                if (finalWorkerBody.length >= 48) {
                    break;
                }
            }
            const otherRoomActiveHarvesterBody = [MOVE,MOVE,CARRY,WORK]
            const otherRoomActiveHarvesterBodyCost = 250;
            let numOtherRoomActiveHarvesterBody = Math.floor(roomSpawns[0].room.energyCapacityAvailable / (1 * otherRoomActiveHarvesterBodyCost));
            let finalOtherRoomActiveHarvesterBody = [];
            for (let i = 0; i < numOtherRoomActiveHarvesterBody; i++) {
                finalOtherRoomActiveHarvesterBody = finalOtherRoomActiveHarvesterBody.concat(otherRoomActiveHarvesterBody);
                if (finalOtherRoomActiveHarvesterBody.length >= 48) {
                    break;
                }
            }
            
            let transfererBody = [MOVE,CARRY];
            let transfererBodyCost = 100;
            let numTransfererBody = Math.floor(roomSpawns[0].room.energyCapacityAvailable / (2 * transfererBodyCost));
            let finalTransfererBody = [];
            //if there are zero transferers (existed or spawning) in the room and there need to be transferers, spawn with whatever energy is available, otherwise spawn with half of the total potential energy available
            if (roomTransferers.length == 0 && roomTransferers.length < desiredCreeps.desiredTransferers) {
                numTransfererBody = Math.floor(roomSpawns[0].room.energyAvailable / transfererBodyCost)
            }
            else {
                numTransfererBody = Math.floor(roomSpawns[0].room.energyCapacityAvailable / (2 * transfererBodyCost));
            }
            for (let i = 0; i < numTransfererBody; i++) {
                finalTransfererBody = finalTransfererBody.concat(transfererBody);
                if (finalTransfererBody.length >= 50) {
                    break;
                }
            }
            //if not enough extensions, make container harvester weak
            let finalContainerHarvesterBody;
            let containerHarvesterCost;
            if (extensions.length < 5) {
                finalContainerHarvesterBody = [MOVE,MOVE,WORK,WORK];
                containerHarvesterCost = 300;
            }
            else if (extensions.length < 10) {
                finalContainerHarvesterBody = [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK];
                containerHarvesterCost = 550;
            }
            else {
                finalContainerHarvesterBody = [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK];
                containerHarvesterCost = 750;
            }

            if (roomActiveHarvesters.length < desiredCreeps.desiredActiveHarvesters && roomSpawns[0].room.energyAvailable >= numWorkerBody * workerBodyCost){
                console.log(
                    roomSpawns[0].spawnCreep(finalWorkerBody, 'Active Harvester ' + Math.floor(Math.random() * 100000), 
                    {memory: {role:'activeHarvester',chosenSource:0,harvestMode:mainHarvestMode,homeRoom:room.name}})
                );
            }
            else if (roomTransferers.length < desiredCreeps.desiredTransferers && roomSpawns[0].room.energyAvailable >= numTransfererBody * transfererBodyCost){
                console.log(
                    roomSpawns[0].spawnCreep(finalTransfererBody, 'Transferer ' + Math.floor(Math.random() * 100000), 
                    {memory: {role:'transferer',draining:true,homeRoom:room.name}})
                );
            }
            else if (roomContainerHarvesters.length < desiredCreeps.desiredContainerHarvesters && roomSpawns[0].room.energyAvailable >= containerHarvesterCost){
                console.log(
                    roomSpawns[0].spawnCreep(finalContainerHarvesterBody, 'Container Harvester ' + Math.floor(Math.random() * 100000), 
                    {memory: {role:'containerHarvester',chosenSource:0,homeRoom:room.name}})
                );
            }
            else if (roomUpgraders.length < desiredCreeps.desiredUpgraders && roomSpawns[0].room.energyAvailable >= numWorkerBody * workerBodyCost){
                console.log(
                    roomSpawns[0].spawnCreep(finalWorkerBody, 'Upgrader ' + Math.floor(Math.random() * 100000), 
                    {memory: {role:'upgrader',chosenSource:0,harvestMode:mainHarvestMode,homeRoom:room.name}})
                );
            }
            else if (roomSpawns[0].room.find(FIND_CONSTRUCTION_SITES).length >= 1 && roomBuilders.length < desiredCreeps.desiredBuilders && roomSpawns[0].room.energyAvailable >= numWorkerBody * workerBodyCost){
                console.log(
                    roomSpawns[0].spawnCreep(finalWorkerBody, 'Builder ' + Math.floor(Math.random() * 100000), 
                    {memory: {role:'builder',chosenSource:0,harvestMode:mainHarvestMode,homeRoom:room.name}})
                );
            }
            else if (roomRepairers.length < desiredCreeps.desiredRepairers && roomSpawns[0].room.energyAvailable >= numWorkerBody * workerBodyCost){
                console.log(
                    roomSpawns[0].spawnCreep(finalWorkerBody, 'Repairer ' + Math.floor(Math.random() * 100000), 
                    {memory: {role:'repairer',chosenSource:0,harvestMode:mainHarvestMode,homeRoom:room.name}})
                );
            }
            //currently set to only spawn these creeps from spawn 1
            // else if (otherRoomActiveHarvesters.length < desiredOtherRoomActiveHarvesters && Game.spawns['Spawn1'].room.energyAvailable >= numOtherRoomActiveHarvesterBody * otherRoomActiveHarvesterBodyCost){
            //     console.log(
            //         Game.spawns['Spawn1'].spawnCreep(finalOtherRoomActiveHarvesterBody, 'Other Room Harvester ' + Math.floor(Math.random() * 100000), 
            //         {memory: {role:'otherRoomActiveHarvester',chosenRoom:'E22S37',homeRoom:'E22S36'}})
            //     );
            // }
        }
    }
}
}
module.exports = managerSpawning;