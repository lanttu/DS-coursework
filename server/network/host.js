'use strict';

var winston = require('winston');

var RemotePlayer = require('./remotePlayer');


// var S_WAITING = 'waiting';
// var S_HALT    = 'halt';
// var S_PLAYING = 'playing';


/**
 * 
 * @class network.Host
 * 
 * @param {Object} config 
 */
var Host = module.exports = function (game, config) {
    var host = this;

    // Exposed game
    this.game = game;
    this.remotes = [];

    // Listen incoming connections
    this.io = require('socket.io').listen(config.port);
    this.io.set('log level', 1);
    this.io.on('connection', function (socket) {
        socket.on('handshake', function (id) {
            host.handleConnection(id, socket);
        });
    });
};


/**
 * Creates new player or rejoins player depending on the current state
 * 
 * @module
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