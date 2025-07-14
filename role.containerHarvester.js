var roleContainerHarvester = {
    run:function(creep) {
        let sources = creep.room.getSources();
        /*for (let i = 0; i < sources.length; i++){
            if (creep.memory.chosenSource == i){
                creep.memory.chosenFlag = Game.flags['Harv' + i];
            }
        }*/
        // if (!creep.memory.chosenContainer) {
        //     creep.memory.chosenContainer = creep.memory.chosenSource;
        //     for (let i in containers) {
        //         for (let j in creep.room.getCreeps()) {
        //             if (creep[j].memory.role == "containerHarvester" && creep[j].pos == containers[i].pos) {
        //                 ++creep.memory.chosenContainer;
        //             }
        //         }
        //     }
        // }
        // creep.memory.chosenContainer = 

        if (!creep.memory.claimedContainer) {
            creep.memory.claimedContainer = creep.room.getUnclaimedContainer();
        }
        else {
            // Memory can only store primitives, as it is JSON stringified, so we must convert the values to an object:
            let container = Game.getObjectById(creep.memory.claimedContainer.id);
            if (creep.memory.claimedContainer && !creep.memory.linkedSource) {
                creep.memory.linkedSource = container.pos.findClosestByRange(sources);
            }
            let source = Game.getObjectById(creep.memory.linkedSource.id);
            if (!creep.pos.isEqualTo(container.pos)) {
                creep.moveTo(container.pos);
            }
            else {
                creep.harvest(source);
            }
        }

        //find other creeps in room pos and compare to flag pos
        // if (creep.pos.x == creep.memory.chosenFlag.pos.x && creep.pos.y == creep.memory.chosenFlag.pos.y && creep.pos.roomName == creep.memory.chosenFlag.pos.roomName) {
        //     creep.harvest(sources[creep.memory.chosenSource]);
        // }
        // else if (creep.room.lookForAt(LOOK_CREEPS, creep.memory.chosenFlag.pos.x, creep.memory.chosenFlag.pos.y).length) {
        //     creep.memory.chosenSource = creep.memory.chosenSource + 1;
        //     if (creep.memory.chosenSource >= sources.length){
        //         creep.memory.chosenSource = 0;
        //     }
        //     //chosenSource is changing correctly, but flag is not changing
        //     let flagNum = creep.memory.chosenSource;
        //     creep.memory.chosenFlag = Game.flags['Harv' + flagNum +'.'+ creep.memory.homeRoom.name];
        //     //creep.memory.chosenFlag.name = creep.memory.chosenFlag.name.slice(0,4) + String(flagNum);
        // }
        // else {
        //     creep.moveTo(creep.memory.chosenFlag.pos.x, creep.memory.chosenFlag.pos.y); 
        // }
    }
}

module.exports = roleContainerHarvester;