/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.room');
 * mod.thing == 'a thing'; // true
 */
var prototypeRoom = {
    run:function() {
        Room.prototype.getSources = function () {
            if (!this._sources) {
                this._sources = this.find(FIND_SOURCES);
            }
            return this._sources;
        }
        Room.prototype.getConstructionSites = function () {
            if (!this._constructionSites) {
                this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
            }
            return this._constructionSites;
        }
        Room.prototype.getContainers = function () {
            if (!this._containers) {
                this._containers = this.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER);
                    }
                });
            }
            return this._containers;
        }
        Room.prototype.getCreeps = function () {
            if (!this._creeps) {
                this._creeps = this.find(FIND_MY_CREEPS);
            }
            return this._creeps;
        }
        Room.prototype.getUnclaimedContainer = function () {
            let containers = this.getContainers();
            let chosenContainerIndex = 0;
            let creeps = this.getCreeps();
            // This for loop will have problems if there are more than 2 sources or 2 container harvesters.
            for (let name in creeps) {
                if (creeps[name].memory.role == "containerHarvester" && creeps[name].memory.claimedContainer) {
                    if (creeps[name].memory.claimedContainer.id == containers[chosenContainerIndex].id) ++chosenContainerIndex;
                }
            }
            // if (Object.keys(unclaimedContainers).length > 0) {
            //     return unclaimedContainers[0];
            // }
            return containers[chosenContainerIndex];
        }
    }
}
module.exports = prototypeRoom;