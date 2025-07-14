//My main branch, started this one November of 2021
// Coming back to check it out July 2025

//TO DO:
//Upgrade walls based on whether or not there is a healthy amount of energy in storage, up to a maximum
//Fix towers being able to be baited
//If towers can't kill a creep because of damage falloff, spawn some defender creeps to help them out
//make defender creep ;)
//take over da world
// Improved spawning queue (allow sending creeps from stronger rooms to weaker rooms if energy permits)

//Starting Creep: roomSpawns[0].spawnCreep([MOVE,MOVE,CARRY,CARRY,WORK], "Placeholder", {memory: {role:'upgrader',chosenSource:0}});
//Builder for starting a room, change homeroom memory item: Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK,WORK,WORK], "Helper " + Math.floor(Math.random() * 100000), {memory: {role:'builder',chosenSource:0,homeRoom:'E21S37'}});
//Create roles, "require" is like "import" in python
let roleContainerHarvester = require('role.containerHarvester');
let roleTransporter = require('role.transporter');
let roleActiveHarvester = require('role.activeHarvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleTransferer = require('role.transferer');
let roleDestroyer = require('role.destroyer');
let roleOtherRoomActiveHarvester = require('role.otherRoomActiveHarvester');
let roleClaimer = require('role.claimer');
let roleZergling = require('role.zergling');
let managerSpawning = require('manager.spawning');
let managerTowers = require('manager.towers');
let prototypeRoom = require('prototype.room');
let prototypeRoomPosition = require('prototype.roomPosition');

//choose how many of each creep to spawn
let desiredContainerHarvesters = 0;
let desiredTransporters = 0;
let desiredActiveHarvesters = 0;
let desiredUpgraders = 0;
let desiredBuilders = 0;
let desiredRepairers = 0;
let desiredTransferers = 0;
let desiredOtherRoomActiveHarvesters = 0;

module.exports.loop = function () {
    console.log('----------------------------------------------------------');
    prototypeRoom.run();
    prototypeRoomPosition.run();
    let totalCreeps = 0;
    //Remove old creep data and run each creep through its role
    for (let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (!creep.memory.homeRoom) creep.memory.homeRoom = creep.room.name;
        
        if (creep.memory.role == "containerHarvester") roleContainerHarvester.run(creep);
        else if (creep.memory.role == "transporter") roleTransporter.run(creep);
        else if (creep.memory.role == "activeHarvester") roleActiveHarvester.run(creep);
        else if (creep.memory.role == "upgrader") roleUpgrader.run(creep);
        else if (creep.memory.role == "builder") roleBuilder.run(creep);
        else if (creep.memory.role == "repairer") roleRepairer.run(creep);
        else if (creep.memory.role == "transferer") roleTransferer.run(creep);
        else if (creep.memory.role == "tester") roleTester.run(creep);
        else if (creep.memory.role == "destroyer") roleDestroyer.run(creep);
        else if (creep.memory.role == "otherRoomActiveHarvester") roleOtherRoomActiveHarvester.run(creep);
        else if (creep.memory.role == "claimer") roleClaimer.run(creep);
        else if (creep.memory.role == "zergling") roleZergling.run(creep);
        ++totalCreeps;
    }
    //Code to run for each room
    let controlledRooms = [];
    for (let name in Game.rooms) {
        if (Game.rooms[name].controller.my) {
            controlledRooms.push(Game.rooms[name]);
        }
    }
    
    for (let i = 0; i < controlledRooms.length; ++i) {
        let numHomeRoomCreeps = 0;
        let numCreepsInRoom = 0;
        for (let name in Game.creeps) {
            if (Game.creeps[name].memory.homeRoom == controlledRooms[i].name) ++numHomeRoomCreeps;
            if (Game.creeps[name].room.name == controlledRooms[i].name) ++numCreepsInRoom;
        }
        //Define Controller
        let roomController = controlledRooms[i].controller;
        let towers = controlledRooms[i].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER)
            }
        });
        //Change desired creeps based on room level
        if (roomController.level == 1) {
            desiredContainerHarvesters = 0;
            desiredTransporters = 0;
            desiredActiveHarvesters = 2;
            desiredUpgraders = 3;
            desiredBuilders = 1;
            desiredRepairers = 0;
            desiredTransferers = 0;
        }
        else if (roomController.level == 2) {
            desiredContainerHarvesters = 0;
            desiredTransporters = 0;
            desiredActiveHarvesters = 2;
            desiredUpgraders = 3;
            desiredBuilders = 3;
            desiredRepairers = 0;
            desiredTransferers = 0;
        }
        else if (roomController.level == 3) {
            desiredContainerHarvesters = Object.keys(controlledRooms[i].getSources()).length;
            desiredTransporters = 0;
            desiredActiveHarvesters = 0;
            desiredUpgraders = 5;
            desiredBuilders = 1;
            desiredRepairers = 0;
            desiredTransferers = 2;
        }
        else if (roomController.level == 4) {
            desiredContainerHarvesters = Object.keys(controlledRooms[i].getSources()).length;
            desiredTransporters = 0;
            desiredActiveHarvesters = 0;
            desiredUpgraders = 5;
            desiredBuilders = 1;
            desiredRepairers = 0;
            desiredTransferers = 3;
        }
        else if (roomController.level == 5) {
            desiredContainerHarvesters = Object.keys(controlledRooms[i].getSources()).length;
            desiredTransporters = 0;
            desiredActiveHarvesters = 0;
            desiredUpgraders = 5;
            desiredBuilders = 1;
            desiredRepairers = 0;
            desiredTransferers = 3;
        }
        else if (roomController.level == 6) {
            desiredContainerHarvesters = Object.keys(controlledRooms[i].getSources()).length;
            desiredTransporters = 0;
            desiredActiveHarvesters = 0;
            desiredUpgraders = 2;
            desiredBuilders = 1;
            desiredRepairers = 0;
            desiredTransferers = 2;
        }
        else if (roomController.level == 7) {
            desiredContainerHarvesters = Object.keys(controlledRooms[i].getSources()).length;
            desiredTransporters = 0;
            desiredActiveHarvesters = 0;
            desiredUpgraders = 2;
            desiredBuilders = 1;
            desiredRepairers = 0;
            desiredTransferers = 2;
        }
        else if (roomController.level == 8) {
            desiredContainerHarvesters = Object.keys(controlledRooms[i].getSources()).length;
            desiredTransporters = 0;
            desiredActiveHarvesters = 0;
            desiredUpgraders = 1;
            desiredBuilders = 1;
            desiredRepairers = 0;
            desiredTransferers = 2;
        }
        let desiredCreeps = {
            desiredContainerHarvesters,
            desiredTransporters,
            desiredActiveHarvesters,
            desiredUpgraders,
            desiredBuilders,
            desiredRepairers,
            desiredTransferers
        }

        managerSpawning.run(controlledRooms[i], desiredCreeps);
        managerTowers.run(controlledRooms[i]);

        // Pretty console stuff goes here:
        console.log("Room: " + controlledRooms[i].name + "  Lvl: " + roomController.level);
        // Print room energy
        console.log("  Energy: " + controlledRooms[i].energyAvailable);
        // Print creep count
        console.log("  Creeps: " + numCreepsInRoom);
        let activeHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'activeHarvester' && creep.memory.homeRoom == controlledRooms[i].name);
        if(activeHarvesters.length > 0){console.log('    Active Harvesters: '+activeHarvesters.length+'/'+desiredActiveHarvesters);}
        let containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester' && creep.memory.homeRoom == controlledRooms[i].name);
        if(containerHarvesters.length > 0){console.log('    Container Harvesters: '+containerHarvesters.length+'/'+desiredContainerHarvesters);}
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.homeRoom == controlledRooms[i].name);
        if(upgraders.length > 0){console.log('    Upgraders: '+upgraders.length+'/'+desiredUpgraders);}
        let transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter' && creep.memory.homeRoom == controlledRooms[i].name);
        if(transporters.length > 0){console.log('    Transporters: '+transporters.length+'/'+desiredTransporters);}
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.homeRoom == controlledRooms[i].name);
        if(builders.length > 0){console.log('    Builders: '+builders.length+'/'+desiredBuilders);}
        let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.homeRoom == controlledRooms[i].name);
        if(repairers.length > 0){console.log('    Repairers: '+repairers.length+'/'+desiredRepairers);}
        let transferers = _.filter(Game.creeps, (creep) => creep.memory.role == 'transferer' && creep.memory.homeRoom == controlledRooms[i].name);
        if(transferers.length > 0){console.log('    Transferers: '+transferers.length+'/'+desiredTransferers);}
        let otherRoomActiveHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'otherRoomActiveHarvester' && creep.memory.homeRoom == controlledRooms[i].name);
        if(otherRoomActiveHarvesters.length > 0){console.log('    Other Room Active Harvesters: '+otherRoomActiveHarvesters.length);}
        let destroyers = _.filter(Game.creeps, (creep) => creep.memory.role == 'destroyer');
        if(destroyers.length > 0){console.log('    Destroyers: '+destroyers.length);}
    }
}