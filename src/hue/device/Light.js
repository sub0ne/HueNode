const BaseDevice = require('./BaseDevice.js');

class Light extends BaseDevice {
    
    // States
    _on = false;

    constructor(parameters) {
        super(parameters);
    }

}

module.exports = Light;