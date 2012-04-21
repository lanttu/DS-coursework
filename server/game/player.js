exports = module.exports = Player;


/**
 * Player constructor
 *
 * Player -> Host = action
 * Host -> Player = event
 *
 * @param {String} id Player id
 */ 
function Player (id) {
    var player = this;

    this.id = null;

    // Register debug listener for all actions player can trigger
    player.actions.forEach(function (act) {
        player.on(act, function () {
            console.debug('Player ' + player.id + ' >> ' + act, arguments);
        });
    });
}

Player.prototype.__proto__ = process.EventEmitter.prototype;


/**
 * Method for sending events from game to player
 *
 * @param {String} event Event name
 */
Player.prototype.send = function (event) {
    var args = Array.prototype.slice.call(arguments, 1);
    console.debug('Player ' + this.id + ' << ' + event, args);
}


/**
 * All possible actions player can do
 */
Player.prototype.actions = ['see', 'players', 'disconnect'];