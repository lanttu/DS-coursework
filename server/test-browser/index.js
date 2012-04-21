var test = module.exports = {};

test.init = function (app, config) {
    console.info('Initializing test-browser');

    test._config = config;

    app.get('/test', test.serveIndex);
}

test.serveIndex = function (req, res) {
    res.sendfile(__dirname + '/index.html');
    // res.send('ASDSADa');
}