var Player = require('./player');

exports = module.exports = LocalPlayer;


/**
 * LocalPlayer constructor
 *
 * @param {String} id
 * @param {BrowserEndpoint} bEndpoint
 */
function LocalPlayer (id, bEndpoint) {
    var player = this;
    Player.apply(player, arguments); // Call Player constructor

    this.bEndpoint = bEndpoint;
    bEndpoint.player = this;
}


LocalPlayer.prototype.__proto__ = Player.prototype;


/**
 * Forward events from host to BrowserEndpoint
 *
 */
LocalPlayer.send = function () {
    var player = this;
    Player.prototype.send.apply(player, arguments);

    player.bEndpoint.send.apply(player.bEndpoint, arguments);
    // var args = Array.prototype.slice.call(arguments, 1);
}