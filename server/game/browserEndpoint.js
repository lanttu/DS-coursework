var Host        = require('./game/host'),
    LocalPlayer = require('./game/localPlayer');

exports = module.exports = BrowserEndpoint;


function BrowserEndpoint (app, config) {
    var endpoint = this;

    // Initialize variables
    this.config = config;
    this.socket = null;

    // Listen connecting browsers
    this.io = require('socket.io').listen(app);
    this.io.on('connect', function (socket){
        console.debug('Browser connecting...');

        if (endpoint.socket) {
            console.debug('Endpoint already reserved');
            socket.emit('handshake', false);
            socket.disconnect();

        } else {
            endpoint.socket = socket;
            endpoint.initConnection(socket);
            socket.emit('handshake', true);
            console.debug('Browser connection established');
        }
    });

    // By default, host game
    endpoint.createGame();
}


/**
 * 
 */
BrowserEndpoint.prototype.initConnection = function (socket) {
    var endpoint = this;

    // Release endpoint on disconnect
    socket.on('disconnect', function () {
        if (socket == endpoint.socket) {
            socket.removeAllListeners();
            endpoint.socket = null;
            console.info('Endpoint released');
        }
    });


    // Local events
    socket.on('join', function (address) {
        endpoint.joinGame(address);
    });

    socket.on('leave', function () {
        endpoint.leaveGame();
    });
    // var localEvents = ['join', 'leave'];
    // localEvents.forEach(function (evt) {
    //     socket.on(evt, function () {
    //         if (endpoint.local) {
    //             var args = Array.prototype.slice.call(arguments);
    //             args.unshift(evt);
    //             endpoint.local.emit.apply(endpoint.local, args);
    //         }
    //     });
    // });


    // Game events delivered to Player object
    var gameEvents = ['see', 'getPlayers'];
    gameEvents.forEach(function (evt) {
        socket.on(evt, function () {
            if (endpoint.player) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(evt);
                endpoint.player.emit.apply(endpoint.player, args);
            }
        });
    });
}


/**
 * Send received events to browser
 */
BrowserEndpoint.prototype.send = function () {
    if (this.socket) {
        this.socket.emit(arguments);
    } else {
        //
    }
}


/**
 * Hosts game
 */
BrowserEndpoint.prototype.createGame = function () {
    var endpoint = this;

    var host = new Host(config.game);
    endpoint.host = host;

    var player = new LocalPlayer('LOCAL');
    host.addPlayer(player);

    endpoint.player = player;
}


/**
 * Clears hosted game
 */
BrowserEndpoint.prototype.clearGame = function () {
    var endpoint = this;
    // TODO Clearing sequence

    endpoint.host = null;
    endpoint.player = null;
}


/**
 *
 */
BrowserEndpoint.prototype.joinGame = function (address) {
    var player = 
}


/**
 *
 */
BrowserEndpoint.prototype.leaveGame = function () {

}