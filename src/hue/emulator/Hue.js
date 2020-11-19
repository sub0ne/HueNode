const HueServer = require ('./HueServer.js');

class Hue {

    _hueServer = undefined;
    _lights = {};

    constructor() {
    }

    stopHue() {
s
        global.getHueNodeService().Logger.info(`[Hue Emulator] Stop Hue`);

        if (this._hueServer && this._hueServer.isRunning()) {
            this._hueServer.stopServer();
        }

    }

    startHue() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Start Hue`);

        if (!this._hueServer) {
            this._hueServer = new HueServer();
        }

        if (!this._hueServer.isRunning()) {
            this._hueServer.startServer();
        }

    }

    getLights() {
        return this._lights;
    }

    getLight(deviceID) {
        return this._lights[deviceID];
    }

}

module.exports = Hue;