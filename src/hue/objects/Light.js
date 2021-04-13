const BaseDevice = require('./BaseDevice.js');

class Light extends BaseDevice {

    static metadata = {
        properties: {
            on: {type: "boolean"}
        }
    };

    constructor(parameters) {
        super(parameters, Light.metadata);
    }

}

module.exports = Light;