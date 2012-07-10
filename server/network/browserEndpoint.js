'use strict';

var winston      = require('winston');
var config       = require('./../config');

var Host         = require('./host');
var ClientPlayer = require('./clientPlayer');
var game         = require('./../game');
var Player       = game.Player;
var Game         = game.Game;


/**
 * Endpoint to which browser connects
 * 
 * @class network.BrowserEndpoint
 */
/**
 * @method constructor
 * Creates endpoint
 * 
 * @param {App} app
 * @param {Object} config
 */
var BrowserEndpoint = module.exports = function (app, config) {
    var endpoint = this;

    // Initialize variables
    this.config = config;
    this.socket = null;

    // Listen connecting browsers
    this.io = require('socket.io').listen(app);
    this.io.set('log level', 1);
    this.io.on('connection', function (socket) {
        winston.info('Browser connecting...');

        if (endpoint.socket) {
            winston.error('Endpoint already reserved');
            socket.emit('handshake', false);
            socket.disconnect();

        } else {
            endpoint.socket = socket;
            endpoint.initConnection(socket);
            socket.emit('handshake', true);
            winston.info('Browser connection established');
            endpoint.updateBrowser();
        }
    });
};


/**
 * Initializes new connection
 * 
 * @method
 * @private
 * 
 * @param {Socket} socket
 */
BrowserEndpoint.prototype.initConnection = function (socket) {
    var endpoint = this;

    // Release endpoint on disconnect
    socket.on('disconnect', function () {
        if (socket === endpoint.socket) {
            socket.removeAllListeners();
            endpoint.socket = null;
            winston.info('Endpoint released');
        }
    });

    // Local events
    socket.on('joinGame', function (address) {
        endpoint.joinGame(address);
    });

    socket.on('createGame', function () {
        endpoint.createGame();
    });

    socket.on('startGame', function () {
        endpoint.startGame();
    });

    // Forwars actions coming from browser to player
    Player.prototype.actions.forEach(function (act) {
        socket.on(act, function () {
            if (!endpoint.player) return;

            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(act);
            endpoint.player.emit.apply(endpoint.player, args);
        });
    });
};



BrowserEndpoint.prototype.updateBrowser = function () {
    if (this.player) {
        // Get game state
        this.player.emit('getState');
    } else {
        // No state if no player set
        this.send('state', null);
    }

};




/**
 * Forward events to browser
 */
BrowserEndpoint.prototype.send = function () {
    if (this.socket) {
        this.socket.emit.apply(this.socket, arguments);
    } else {
        winston.error('No socket');
    }
};


/**
 * Hosts game
 * 
 * @method
 * @public
 * 
 */
BrowserEndpoint.prototype.createGame = function () {
    var endpoint = this;

    if (this.game) {
        // Reset existing game
        this.game.reset();
    } else {
        // Create new game and host it
        var game = new Game(3);
        var host = new Host(game, config.game);

        endpoint.host = host;
        endpoint.game = game;

        var player = new Player(config.username);
        endpoint.setPlayer(player);
        game.addPlayer(player);

        // When local player quits, stop hosting and end game
        player.on('quit', function () {
            host.close();
            game.close();

            delete endpoint.host;
            delete endpoint.game;
        });
    }


};


BrowserEndpoint.prototype.startGame = function () {
    if (!this.game) return;

    this.game.play();
};


/**
 * Joins game hosted by someone else
 * 
 * @param {String} address Host address
 */
BrowserEndpoint.prototype.joinGame = function (address) {
    var player = new ClientPlayer(address, config.username);
    this.setPlayer(player);
};


BrowserEndpoint.prototype.setPlayer = function (player) {
    var endpoint = this;
    
    // TODO clear old player

    this.player = player;

    // Forward events from game (through player) to browser
    Player.prototype.events.forEach(function (evt) {
        player.on(evt, function () {
            if (!endpoint.socket) return; // Abort if no browser connected

            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(evt);

            endpoint.socket.emit.apply(endpoint.socket, args);
        });
    });


    player.on('quit', function () {
        endpoint.player = null;
        endpoint.updateBrowser();
    });
};