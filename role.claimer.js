var roleClaimer = {
    run:function(creep){
        // Game.spawns['Spawn1'].spawnCreep([MOVE,CLAIM],'ClaimGuy',{memory: {role:'claimer', homeRoom:'W8S8'}})
        // Game.creeps['ClaimGuy'].signController(Game.creeps['ClaimGuy'].room.controller, 'thorn glognuts');
        // If wanting to automate later, store room to claim in memory
        const roomToClaim = 'W7S8';
        if (creep.room.name == roomToClaim) {
            if (!creep.room.controller.my) {
                if (creep.room.controller.level == 0) {
                    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                else {
                    if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
            // else if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(creep.room.controller);
            // }
        }
        else {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.homeRoom));
        }
    }
};
module.exports = roleClaimer;