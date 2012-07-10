var fs = require('fs');

module.exports = {
    browser: {
        port: 3000
    },
    game: {
        port: 5000
    },


    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem')
};