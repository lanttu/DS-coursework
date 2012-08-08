'use strict';

var io           = require('socket.io-client');
var winston      = require('winston');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var game         = require('./../game');
var Player       = game.Player;

/**
 * Client for RemotePlayer
 * 
 * @class network.ClientPlayer
 * @extends EventEmitter
 */
/**
 * @method constructor
 * Creates client for remote player
 * 
 * @param {String} address
 * @param {String} name Player name (id)
 */
var ClientPlayer = module.exports = function (address, name) {
    var client = this;
    this.quit = false;

    name = name || 'Client';

    // Listen incoming connections
    this.socket = io.connect(address, {
        // 'secure'                    : true,
        'connect timeout'           : 1500,
        'reconnect'                 : false,
        'try multiple transports'   : false,
        'force new connection'      : true
        // 'log level'                 : 5
    });
    this.socket.on('connect', function () {
        client.socket.emit('handshake', name);
    });

    this.socket.on('connect_failed', function () {
        if (client.quit) return;

        client.emit('quit', 'Connection failed');
        client.quit = true;
    });
    this.socket.on('error', function () {
        if (client.quit) return;

        client.emit('quit', 'Connection failed');
        client.quit = true;
    });
    this.socket.on('disconnect', function () {
        if (client.quit) return;

        client.emit('quit', 'Connection failed');
        client.quit = true;
    });


    // Behave as a proxy emitter for events coming from host machine
    Player.prototype.events.forEach(function (evt) {
        client.socket.on(evt, function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(evt);
            client.emit.apply(client, args);
        });
    });

    // Forward local events to host machine
    Player.prototype.actions.forEach(function (act) {
        client.on(act, function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(act);
            client.socket.emit.apply(client.socket, args);
        });
    });
};


util.inherits(ClientPlayer, EventEmitter);