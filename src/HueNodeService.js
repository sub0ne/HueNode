const Logger = require('./Logger.js');
const HueConfiguration = require('./hue/configuration/Hueconfiguration.js');

let hueConfigInstance = undefined;

class HueNodeService {

    constructor() {
    }

    getLogger() {
        return Logger.getLogger();
    }

    getHueConfiguration() {

        if (!hueConfigInstance) {
            hueConfigInstance = new HueConfiguration();
        }

        return hueConfigInstance;

    }

}

module.exports = HueNodeService;