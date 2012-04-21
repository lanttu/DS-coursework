var config  = require('./config'),
    app     = require('express').createServer(),
    BrowserEndpoint = require('./game/BrowserEndpoint'),
    Manager = require('./manager'),
    Host    = require('./game/host');


app.listen(config.browser.port);

var bEndpoint = new BrowserEndpoint(app, config);

var host = new Host(config.game);



require('./test-browser').init(app, config);
