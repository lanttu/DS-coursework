var LocalPlayer = require('./../game/localPlayer');

describe('LocalPlayer', function () {

    beforeEach(function () {
        this.id = 'LOCAL';
        this.player = new LocalPlayer(this.id);
    });
});