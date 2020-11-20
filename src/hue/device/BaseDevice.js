class BaseDevice {

    _deviceID = undefined;
    _templateType = undefined;
    _name = undefined;
    _uniqueID = undefined;

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

    setState(state, value) {

        const propertyName = `_${state}`

        if (this.hasOwnProperty(propertyName)) {
            this[propertyName] = value;
            return true;
        } else {
            return false;
        }

    }

    getState(state) {

        const propertyName = `_${state}`

        if (this.hasOwnProperty(propertyName)) {
            return this[propertyName];
        } else {
            return undefined;
        }

    }

}

module.exports = BaseDevice;