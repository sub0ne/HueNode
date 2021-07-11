const Logger = require('./Logger.js');
const HueConfiguration = require('./hue/configuration/HueConfiguration.js');
const Hue = require('./hue/emulator/Hue.js');
const UPnPServer = require('./upnp/UPnPServer.js');
const TemplateProcessor = require('./templates/TemplateProcessor.js');

let hueConfigInstance = undefined;
let hueInstance = undefined;
let upnpServerInstance = undefined;
let templateProcessorInstance = undefined;

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

    /**
     * get the Hue instance (singleton)
     */
    getHue() {

        if (!hueInstance) {
            hueInstance = new Hue();
        }

        return hueInstance;

    }

    /**
     * get the UPnPServer instance
     */
    getUPnPServer() {

        if (!upnpServerInstance) {
            upnpServerInstance = new UPnPServer();
        }

        return upnpServerInstance;

    }

    /**
     * getter for TemplateProcessor
     */
    getTemplateProcessor() {

        if (!templateProcessorInstance) {
            templateProcessorInstance = new TemplateProcessor();
        }

        return templateProcessorInstance;
    }

    /**
     * set log level to configured log level after emulator startup
     */
    setLoggerToLogLevel() {

        if (this.getHueConfiguration().getLogLevel()) {
            this.Logger = Logger.getLogger(this.getHueConfiguration().getLogLevel());
        }
    }

}

module.exports = HueNodeService;