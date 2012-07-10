'use strict';

var Player = require('./../game/player');
var util   = require('util');


/**
 * Remote player
 * 
 * Behaves as a proxy between Game and ClientPlayer
 * 
 * @class network.RemotePlayer
 * @extends game.Player
 * 
 * @param {String} id
 * @param {Socket} socket
 */
var RemotePlayer = module.exports = function (id, socket) {
    Player.call(this, id);
    var player = this;

    this.setSocket(socket);

    // Forward events from player to socket
    Player.prototype.events.forEach(function (evt) {
        player.on(evt, function () {
            if (player.socket) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(evt);
                player.socket.emit.apply(player.socket, args);
            }
        });
    });
};

util.inherits(RemotePlayer, Player);

RemotePlayer.prototype.setSocket = function (socket) {
    var player = this;

    this.socket = socket;

    socket.on('disconnect', function () {
        player.socket = null;
    });

    // Behave as a proxy for actions coming from socket
    Player.prototype.actions.forEach(function (act) {
        socket.on(act, function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(act);
            player.emit.apply(player, args);
        });
    });
}
