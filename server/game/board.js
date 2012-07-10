'use strict';

var winston = require('winston');

var COLS = 4;

/**
 * 
 * @class game.Board
 * 
 * @param {Number} pairs Number of pairs
 */
var Board = module.exports = function (pairs) {
    // var count = pairs * 2;
    // var rows  = Math.ceil(count / COLS);
    var cards = [];
    var i = 0, cardId, x = 0, y = 0;

    // Create cards
    while (i < pairs) {
        cardId = this.generateCardId(i);
        cards.push(cardId);
        cards.push(cardId);
        i++;
    }

    this.cards = [];

    // Create columns
    while (this.cards.length < COLS) this.cards.push([]);

    while (cards.length > 0) {
        // Get random card
        cardId = cards.splice(Math.floor((Math.random() * cards.length)), 1)[0];

        // Place it to the board
        this.cards[x].push(cardId);
        x += 1;
        if (x >= COLS) {
            x = 0;
            y += 1;
        }
    }
};


/**
 * Returns card id at the given position
 * 
 * @method
 * 
 * @param {Numeric} x Column
 * @param {Numeric} y Row
 * @return {String|null} Card ID or null if card is removed
 */
Board.prototype.getCard = function (x, y) {
    if (x < 0 || x > COLS) throw new Error('Out of bounds');
    if (y < 0 || y > this.cards[x].length) throw new Error('Out of bounds');

    return this.cards[x][y];
};


/**
 * Removes card from the table
 * 
 * @method
 * 
 * @param {Numeric} x Column
 * @param {Numeric} y Row
 * @return {String|null} Card value before removing
 */
Board.prototype.removeCard = function (x, y) {
    var cardId = this.getCard(x, y);
    this.cards[x][y] = null;
    return cardId;
};


Board.prototype.getState = function () {
    var state = [];
    var x     = 0;
    var y     = 0;
    var card, col;

    while (x < COLS) {
        col = [];
        state.push(col);

        while (y < this.cards[x].length) {
            card = this.getCard(x, y);
            col.push(card ? true : false);
            y++;
        }

        y = 0;
        x++;
    }

    return state;
};


/**
 * Creates card id number
 * 
 * @method
 * @private
 * 
 * @param {Number} runningNum 
 * @return {String}
 */
Board.prototype.generateCardId = function (runningNum) {
    return String(runningNum);
};


Board.prototype.getCardCount = function () {
    var count = 0;
    var x     = 0;
    var y     = 0;

    while (x < COLS) {
        while (y < this.cards[x].length) {
            if (this.getCard(x, y)) count++;
            y++;
        }

        y = 0;
        x++;
    }

    return count;
};