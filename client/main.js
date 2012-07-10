'use strict';

// var address = 'http://localhost:3000';
var address = window.location.origin;
var socket = null;


$(function () {

    $('#btnHost').click(function () {
        socket.emit('createGame');
    });

    $('#btnJoin').click(function () {
        socket.emit('joinGame', $('#address').val());
    });

    $('#btnLeave').click(function () {
        socket.emit('quit');
    });

    $('#btnStart').click(function () {
        socket.emit('startGame');
    });

    $('#board').on('click', '.card', function () {
        var x = $(this).data('x');
        var y = $(this).data('y');
        socket.emit('see', x, y);
        return false;
    });

    //
    // Connect to local proxy
    // 
    socket = io.connect(address);
    socket.on('handshake', function (accepted) {
        if (!accepted) {
            $('#alertConnect').show();
        } else {
            init(socket);
        }
    });
});


var visibleCards = [];

function init(socket) {
    socket.on('state', updateState);

    socket.on('card', displayCard);
    socket.on('clear', clearVisibleCards);
    socket.on('end', function (winner) {
        alert('Winner is ' + winner);
    })
}

function updateState(state) {
    console.info('state', state);
    $('#loading').hide();
    if (!state) {
        $('#menu').show();
        $('#game').hide();
        $('#room').hide();
    } else if (state.playing) {
        $('#game').show();
        $('#menu').hide();
        $('#room').hide();
        updateGame(state);
    } else {
        $('#room').show();
        $('#menu').hide();
        $('#game').hide();
        updateRoom(state);
    }
}

function displayCard(x, y, card) {
    var cardEl = $('#board').find('[data-x="' + x +'"][data-y="' + y + '"]');
    cardEl.text(card);
    cardEl.addClass('visible');
    visibleCards.push(cardEl);
}

function clearVisibleCards() {
    var cardEl;
    while (visibleCards.length > 0) {
        cardEl = visibleCards.shift();
        cardEl.removeClass('visible');
        cardEl.text('C');
    }
}

function updatePlayers(el, players, playing) {
    var html, text;

    el.html('');
    players.forEach(function (player) {
        text = player.id;
        if (playing) {
            text += ' ' + player.score + (player.active ? ' *' : '');
        }
        html = $('<li>').html($('<a href="#">').text(text));
        el.append(html);
    });
}

function updateRoom(state) {
    updatePlayers($('#room .players'), state.players, state.playing);
}

function updateGame(state) {
    updatePlayers($('#game .players'), state.players, state.playing);
    updateBoard($('#board'), state.board);
}

function updateBoard(el, board) {
    el.html('');

    var x = 0;
    var y = 0;

    board.forEach(function (col) {
        var colEl = $('<div>').addClass('col');
        col.forEach(function (isCard) {
            if (isCard) {
                colEl.append(card(x, y));
            } else {
                colEl.append(empty());
            }
            y++;
        });
        el.append(colEl);
        x++;
        y = 0;
    });

}

function empty() {
    return $('<div>').addClass('empty').text('E');
}
function card(x, y) {
    var el = $('<div>').addClass('card').text('C');
    el.attr('data-x', x);
    el.attr('data-y', y);
    return el;
}
