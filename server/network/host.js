'use strict';

var winston = require('winston');
var https   = require('https');
var config  = require('./../config');

var RemotePlayer = require('./remotePlayer');


/**
 * @class network.Host
 * Hosts game
 */
/**
 * @method constructor
 * Exposes game to remote players
 * @param {game.Game} game Exposed game
 * @param {Object} config 
 */
var Host = module.exports = function (game, hostConfig) {
    var host = this;

    var app = https.createServer({
        key     : config.key,
        cert    : config.cert,
        port    : hostConfig.port
    });

    // Exposed game
    this.game = game;
    this.remotes = [];

    // Listen incoming connections
    this.io = require('socket.io').listen(hostConfig.port);
    // this.io = require('socket.io').listen(app);
    // this.io.set('log level', 1);
    this.io.on('connection', function (socket) {
        socket.on('handshake', function (id) {
            host.handleConnection(id, socket);
        });
    });
};


/**
 * Creates new player or rejoins player depending on the current state
 * 
 * @method
 * @private
 * 
 * @param {Socket} socket Connection socket
 *
 */
Host.prototype.handleConnection = function (id, socket) {
    var remotePlayer = this.game.getPlayer(id);
    if (remotePlayer) {
        // Reconnecting player
        remotePlayer.setSocket(socket);
        remotePlayer.emit('getState');
    } else {
        // New player
        remotePlayer = new RemotePlayer(id, socket);
        this.game.addPlayer(remotePlayer);
        this.remotes.push(id);
    }
};


/**
 * Stops hosting the game
 * 
 * @method
 */
Host.prototype.close = function () {
    var host = this;

    // Quit all remote players
    this.remotes.forEach(function (id) {
        host.game.getPlayer(id).emit('quit');
    });

    // Stop listening connections
    this.io.server.close();
};