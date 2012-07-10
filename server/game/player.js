'use strict';

var EventEmitter = require('events').EventEmitter;
var winston      = require('winston');
var util         = require('util');

/**
 * Player
 * 
 * @class game.Player
 * @extends EventEmitter
 *
 *      Player -> Host = action
 *      Host -> Player = event
 */
/**
 * Creates player
 * @method constructor
 * @param {String} id Player id
 */ 
var Player = module.exports = function (id) {
    var player = this;

    this.id    = id;
    this.score = 0;

    // Register debug listener for all actions player can trigger
    player.actions.forEach(function (act) {
        player.on(act, function () {
            winston.debug('Player ' + player.id + ' >> ' + act, arguments);
        });
    });

    player.events.forEach(function (evt) {
        player.on(evt, function () {
            winston.debug('Player ' + player.id + ' << ' + evt, arguments);
        });
    })
};

util.inherits(Player, EventEmitter);


/**
 * Adds one point to player
 * 
 * @method
 * 
 * @return {Number} New score
 */
Player.prototype.addScore = function () {
    this.score++;
    return this.score;
}


/**
 * Actions that player may do
 * 
 * @property {Array}
 */
Player.prototype.actions = [
    'quit',     // Leave game
    'getState', // Request current state
    'see'       // See card
    // 'players'   // 
];


/**
 * Events that game may trigger
 * 
 * @property {Array}
 */
Player.prototype.events = [
    'turn',     // Player's turn
    'card',     // Card shown
    'state',    // Game state changed
    'clear',    // Clear visible cards
    'end'       // Game ended
];