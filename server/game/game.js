'use strict';

var winston      = require('winston');
var _            = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var Board        = require('./board');

/**
 * 
 * @class game.Game
 * @extends EventEmitter
 * 
 * @param {Object} config Game config
 */
var Game = module.exports = function (config) {
    // Init variables
    this.players      = [];

    // Init settings
    this.reset();
};

util.inherits(Game, EventEmitter);


/**
 * Addes player to the game
 * 
 * @param {game.Player} player
 * @return {Boolean} True if player added
 */
Game.prototype.addPlayer = function (player) {
    var game = this;

    if (this.playing) return false;

    winston.info('New player ' + player.id);

    this.players.push(player);
    this.emitState();

    // Listen actions coming from the player

    player.on('see', function (x, y) {
        game.seeCard(player, x, y);
    });

    player.on('getState', function () {
        player.emit('state', game.getState());
    });

    player.on('quit', function () {
        game.removePlayer(player);
    });

    return true;
};


Game.prototype.removePlayer = function (player) {
    // Remove from player list
    this.players = _.reject(this.players, function (p) { return p === player; });

    if (this.players.length === 0) {
        // Close game if no players
        this.close();
    } else {
        if (this.activePlayer === player) {
            this.nextTurn();
        } else {
            this.emitState();
        }
    }

};


Game.prototype.getPlayer = function (id) {
    var player = _.find(this.players, function (player) {
        return player.id === id;
    });
    return player;
};

Game.prototype.getNextPlayer = function () {
    var next, i;

    if (this.activePlayer === null) {
        if (this.players.length > 0) {
            next = this.players[0];
        } else {
            next = null;
        }
    } else {
        i = this.players.indexOf(this.activePlayer) + 1;
        if (i >= this.players.length) {
            i = 0;
        }
        next = this.players[i];
    }

    this.activePlayer = next;
    return next;
};


/**
 * Starts game
 * 
 * @method
 * 
 */
Game.prototype.play = function () {
    this.playing = true;
    this.nextTurn();
    this.emit('start');
};


/**
 * Next player's turn
 * 
 * @method
 * @private
 */
Game.prototype.nextTurn = function (samePlayer) {
    var player;

    if (samePlayer) {
        player = this.activePlayer;
    } else {
        player = this.getNextPlayer();
    }

    this.firstCard = null;
    player.emit('turn');
    this.clear();
    this.emitState();
};



Game.prototype.seeCard = function (player, x, y) {
    var game = this;
    var card, firstCard;

    if (this.activePlayer !== player) return false; // Ignore
    if (this.holding) return false; // Ignore

    card = this.board.getCard(x, y);

    if (card === null) throw new Error('Invalid card');

    this.showCard(x, y, card);
    
    if (this.firstCard === null) {
        // First selected card
        this.firstCard = { x: x, y: y };
    } else {
        // Compare cards
        firstCard = this.board.getCard(this.firstCard.x, this.firstCard.y);
        if (card === firstCard && (x !== this.firstCard.x || y !== this.firstCard.y)) {
            // Match
            winston.info('Pair found');

            // Remove both cards
            this.board.removeCard(this.firstCard.x, this.firstCard.y);
            this.board.removeCard(x, y);
            player.addScore();

            // Check and handle game ending
            if (this.end()) return;


            this.nextTurn(true);
            // this.emitState();

            // // Player's turn again
            // this.firstCard = null;
            // game.clear();
            // player.emit('turn');

        } else {
            // Mismatch
            winston.info('Mismatch, next player');
            game.hold(function () {
                game.nextTurn();
            });
        }
    }
};


/**
 * Hold state a moment before calling cb
 *
 * @param {Function} cb
 */
Game.prototype.hold = function (cb) {
    var game = this;

    this.holding = true;

    setTimeout(function () {
        game.holding = false;
        game.clear();
        cb();
    }, 1500);
};

Game.prototype.clear = function () {
    this.players.forEach(function (player) {
        player.emit('clear');
    });
};


Game.prototype.end = function () {
    var cardCount = this.board.getCardCount();
    if (cardCount !== 0) return false;

    // End one round

    // Resolve winner
    var winner = _.max(this.players, function (player) {
        return player.score;
    });

    this.players.forEach(function (player) {
        player.emit('end', winner.id);
    });

    this.emit('end', winner.id);

    this.reset();

    return true;
};


/**
 * Closes game
 * 
 * @method
 */
Game.prototype.close = function () {

};


Game.prototype.reset = function () {
    this.playing      = false;
    this.activePlayer = null;
    this.firstCard    = null;
    this.board        = new Board(4);

    // Reset scores
    this.players.forEach(function (player) {
        player.score = 0;
    });

    this.emitState();

    return true;
};


/**
 * Shows card to all players
 * 
 * @method
 * @private
 * 
 * @param {Numeric} x Column
 * @param {Numeric} y Row
 * @param {String} card Card ID
 */
Game.prototype.showCard = function (x, y, card) {
    this.players.forEach(function (player) {
        player.emit('card', x, y, card);
    });
};


/**
 * Send updated state to all players
 * 
 * @method
 */
Game.prototype.emitState = function () {
    var state = this.getState();
    this.players.forEach(function (player) {
        player.emit('state', state);
    });
};


Game.prototype.getState = function () {
    var game  = this;
    var state = {
        playing: this.playing,
        players: []
    };

    // Players

    this.players.forEach(function (player) {
        state.players.push({
            id          : player.id,
            score       : player.score,
            active      : player === game.activePlayer
        });
    });

    // Board
    state.board = this.board.getState();

    return state;
};