var RemotePlayer = require('./remotePlayer');


exports = module.exports = Host;

var S_WAITING = 'waiting';

function Host (config) {
    var host = this;

    // Init variables
    this.config = config;
    this.state = S_WAITING;
    this.players = {};

    // Listen incoming connections
    this.io = require('socket.io').list(config.port);
    this.io.on('connection', function (socket) {
        host.handleConnection(socket);
    });
}


/**
 * Handle new incoming connection
 *
 * @api private
 */
Host.prototype.handleConnection = function (socket) {
    if (this.state == S_WAITING) {
        var player = new RemotePlayer(socket.id, socket);

        this.players.push(player);
    } else if (this.state == S_HALT) {
        // Rejoining player
    } else {
        socket.emit('handshake', false);
    }
}


Host.prototype.setLocalPlayer = function (player) {

}


Host.prototype.addPlayer = function (player) {
    var host = this;

    if (host.players[player.id]) {
        console.error('Player conflict: ' + player.id);
        return;
    }

    host.players[player.id] = player;

    // Set listeners on player

    // Requesting player details
    player.on('getPlayers', function () {
        player.emit('players', 5);
    });


    // 
    player.on('see', function () {
        // TODO
        // Tarkista onko vuoro
        // Näytä kortti kaikille
    });
}