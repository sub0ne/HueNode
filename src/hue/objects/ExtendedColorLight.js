const DimmableLight = require('./DimmableLight.js');
const mergeDeep = require('merge-deep');

class ExtendedColorLight extends DimmableLight {

    static metadata = {
        properties: {
            hue: {type: "number", defaultValue: 0},
            sat: {type: "number", defaultValue: 0},
            ct: {type: "number", defaultValue: 153},
            xy: {type: "object", defaultValue: [0,0]},
            colormode: {type: "string", defaultValue: "ct"}
        }
    };

    constructor(parameters, metadata) {
        const allMetadata = mergeDeep(ExtendedColorLight.metadata, metadata)
        super(parameters, allMetadata);
    };

    setState(state, value) {

        if (state === "ct") {
            this.setState("colormode","ct");
        } else if (state === "hue" || state === "sat") {
            this.setState("colormode","hs");
        } else if (state === "xy") {
            this.setState("colormode","xy");
        }

        return super.setState(state, value);
    };

}

module.exports = ExtendedColorLight;