class Light {
    
    // States
    _on = false;

    constructor(parameters) {
        this._deviceID = parameters.deviceID;
        this._templateType = parameters.templateType;
        this._name = parameters.name;
        this._uniqueID = parameters.uniqueID;
    }

    getDeviceID() {
        return this._deviceID;
    }

    getTemplateType() {
        return this._templateType;
    }

    getName() {
        return this._name;
    }

    getUniqueID() {
        return this._uniqueID;
    }

    getStateOn() {
        return this._on;
    }

    setStateOn(on) {
        this._on = on;
    }

}

module.exports = Light;