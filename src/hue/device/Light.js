const BaseDevice = require('./BaseDevice.js');

class Light extends BaseDevice {

    static metadata = {
        properties: {
            on: {type: "boolean"}
        }
    };
    
    // properties
    //_on = false;

    constructor(parameters) {
        super(parameters, Light.metadata);
    }

}

module.exports = Light;