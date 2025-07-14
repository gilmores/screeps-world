/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.room');
 * mod.thing == 'a thing'; // true
 */
var prototypeRoomPosition = {
    run:function() {
        RoomPosition.prototype.memoryPosToRoomPosition = function (pos) {
            return new RoomPosition(pos.x, pos.y, pos.roomName);
        }
    }
}
module.exports = prototypeRoomPosition;