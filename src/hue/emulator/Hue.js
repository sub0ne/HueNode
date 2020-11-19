const HueServer = require ('./HueServer.js');

class Hue {

    _hueServer = undefined;
    _lights = [];
    _scenes

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

        /*
            lights: {
                1: {...}
                2: {...}
            }  
          
         */

    }

    getLight(deviceID) {
        
    }

}

module.exports = Hue;