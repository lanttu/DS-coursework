'use strict';

var path            = require('path');
var winston         = require('winston');
var opts            = require('opts');

var config          = require('./config');
var express         = require('express');
var app             = express.createServer({
    key     : config.key,
    cert    : config.cert
});

var BrowserEndpoint = require('./network/BrowserEndpoint');

var options = [
    {
        short: 'p',
        long: 'port',
        description: 'Browser port, default 3000',
        value: true
    },
    {
        short: 'u',
        long: 'user',
        description: 'User ID (nick)',
        value: true,
        required: true

    }
];

opts.parse(options, true);

config.browser.port = parseInt(opts.get('p')) || config.browser.port;
config.username     = opts.get('u');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    colorize: true
});

app.listen(config.browser.port);
app.get('/', function (req, res) {
    res.sendfile(path.join(__dirname, '..', 'client', 'index.html'));
});
app.use(express.static(__dirname + '/../client'));

var bEndpoint = new BrowserEndpoint(app, config);