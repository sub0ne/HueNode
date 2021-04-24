const BaseDevice = require('./BaseDevice.js');
const mergeDeep = require('merge-deep');

class DimmableLight extends BaseDevice {

    static metadata = {
        properties: {
            on: {type: "boolean", defaultValue: false},
            bri: {type: "number", defaultValue: 0}
        }
    };

    constructor(parameters, metadata) {
        const allMetadata = mergeDeep(DimmableLight.metadata, metadata)
        super(parameters, allMetadata);
    }

}

module.exports = DimmableLight;