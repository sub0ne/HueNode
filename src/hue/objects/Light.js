const BaseDevice = require('./BaseDevice.js');

class Light extends BaseDevice {

    static metadata = {
        properties: {
            on: {type: "boolean"},
            bri: {type: "number"},
            hue: {type: "number"},
            sat: {type: "number"},
            ct: {type: "number"},
            xy: {type: "object"},
            colormode: {type: "string"}
        }
    };

    constructor(parameters) {
        super(parameters, Light.metadata);
    }

}

module.exports = Light;