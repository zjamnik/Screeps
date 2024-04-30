var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

var lastEneCheck = Date.now();

module.exports.loop = function () {

    for(var name in Game.rooms) {
        if(Date.now() - lastEneCheck > 5000) {
            console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
            lastEneCheck = Date.now();
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}