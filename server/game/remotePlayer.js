var Player = require('./player');

exports = module.exports = RemotePlayer;


function RemotePlayer (id, socket) {
    var player = this;
    Player.apply(player, arguments);

    player.socket = socket;

    // Forward all actions from socket to player 
    // so Host's listeners will notice it
    player.actions.forEach(function (act) {
        player.socket.on(act, function () {
            player.emit(arguments);
        });
    });
}


RemotePlayer.prototype.__proto__ = Player.prototype;


/**
 * Forward events from host to remote machine
 *
 */
RemotePlayer.prototype.send = function () {
    var player = this;
    this.socket.emit(arguments);
}