'use strict';

var io           = require('socket.io-client');
var winston      = require('winston');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var game         = require('./../game');
var Player       = game.Player;

/**
 * 
 * @class network.ClientPlayer
 * 
 * @param {String} address
 */
var ClientPlayer = module.exports = function (address, name) {
    var client = this;

    name = name || 'Client';

    // Listen incoming connections
    this.socket = io.connect(address);
    this.socket.on('connect', function () {
        client.socket.emit('handshake', name);
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