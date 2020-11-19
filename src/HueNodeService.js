const Logger = require('./Logger.js');
const HueConfiguration = require('./hue/configuration/Hueconfiguration.js');
const Hue = require('./hue/emulator/Hue.js');
const UPnPServer = require('./upnp/UPnPServer.js');

let hueConfigInstance = undefined;
let hueInstance = undefined;
let upnpServerInstance = undefined;

class HueNodeService {

    constructor() {
        this.Logger = Logger.getLogger();
    }

    getHueConfiguration() {

        if (!hueConfigInstance) {
            hueConfigInstance = new HueConfiguration();
        }

        return hueConfigInstance;

    }

    getHue() {

        if (!hueInstance) {
            hueInstance = new Hue();
        }

        return hueInstance;

    }

    getUPnPServer() {

        if (!upnpServerInstance) {
            upnpServerInstance = new UPnPServer();
        }

        return upnpServerInstance;

    }

}

module.exports = HueNodeService;