var browser = module.exports = {};

var server = null;

browser.init = function (app, config) {
    browser._config = config;
    browser._io = require('socket.io').listen(app);
    browser._socket = null;

    browser._io.on('connect', browser.onConnection);
}

browser.onConnection = function (socket) {
    if (browser._socket) {
        console.info('Controller rejected');
        // One browser already connected
        browser.emitHandshake(socket, false);
        socket.disconnect();
    } else {
        console.info('Controller connected');
        browser._socket = socket;
        browser.setListeners(socket);
        browser.emitHandshake(socket, true);
    }
}

browser.emitHandshake = function (socket, success) {
    socket.emit('handshake', success);
}

browser.setListeners = function (socket) {
    socket.on('disconnect', function () {
        if (socket === browser._socket) {
            browser._socket = null;
            console.info('Controller disconnected');
        }    
    });
}