const Logger = require('./Logger.js');
const HueConfiguration = require('./hue/configuration/Hueconfiguration.js');

let hueConfigInstance = undefined;

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

}

module.exports = HueNodeService;