const DimmableLight = require('./DimmableLight.js');
const mergeDeep = require('merge-deep');

class ExtendedColorLight extends DimmableLight {

    static metadata = {
        properties: {
            hue: {type: "number", defaultValue: 0},
            sat: {type: "number", defaultValue: 0},
            ct: {type: "number", defaultValue: 0},
            xy: {type: "object", defaultValue: [0,0]},
            colormode: {type: "string", defaultValue: ""}
        }
    };

    constructor(parameters, metadata) {
        const allMetadata = mergeDeep(ExtendedColorLight.metadata, metadata)
        super(parameters, allMetadata);
    }

}

module.exports = ExtendedColorLight;