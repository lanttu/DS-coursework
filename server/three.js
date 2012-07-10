'use strict';

// Starts three nodes in ports 3001, 3002, 3003

var fork  = require('child_process').fork;
var spawn = require('child_process').spawn;
var path  = require('path');

var nodes = {
    'Tupu': 3001, 
    'Hupu': 3002,
    'Lupu': 3003
};

for (var name in nodes) {
    fork(path.join(__dirname, 'app.js'), ['-p', nodes[name], '-u', name]);
}
// nodes.forEach(function (port) {
//     fork(path.join(__dirname, 'app.js'), ['-p', String(port), '-u']);
//     // spawn('node app.js', ['-p' + port]);
// });
