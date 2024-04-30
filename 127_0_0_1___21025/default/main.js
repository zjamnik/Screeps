var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var lastLog = Date.now();
var creepDefinitions = {
    "harvester": {
        "minCount": 2,
        "variants": {
            "normal": [WORK, CARRY, MOVE],
            "big": [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
        }
    },
    "builder": {
        "minCount": 2,
        "variants": {
            "normal": [WORK, CARRY, MOVE],
            "big": [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
        }
    },
    "upgrader": {
        "minCount": 2,
        "variants": {
            "normal": [WORK, CARRY, MOVE],
            "big": [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
        }
    },
};

var editing = false;
module.exports.loop = function () {
    if (editing) return;

    // var tower = Game.getObjectById('f84398b5d228975dd105a0ca');
    // if (tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if (closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if (closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    console.log();
    for (const role in creepDefinitions) {
        if (Object.hasOwnProperty.call(creepDefinitions, role)) {
            const creep = creepDefinitions[role];

            let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);

            console.log(role[0].toUpperCase() + role.slice(1) + ' count: ' + creeps.length);

            if (creeps.length < creep.minCount) {
                let newName = role[0].toUpperCase() + role.slice(1) + Game.time;

                console.log('Trying to spawn new ' + role + ': ' + newName);

                Game.spawns.Spawn1.spawnCreep(creep.variants.big, newName, { memory: { role: role } });
                Game.spawns['Spawn1'].spawnCreep(creep.variants.normal, newName, { memory: { role: role } });

                if (Game.spawns['Spawn1'].spawning != null) {
                    Game.spawns['Spawn1'].room.visual.text(
                        '🛠️' + Game.spawns['Spawn1'].spawning.name,
                        Game.spawns['Spawn1'].pos.x + 1,
                        Game.spawns['Spawn1'].pos.y,
                        { align: 'left', opacity: 0.8 }
                    );
                }
            }
        }
    }

    for (var name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
};