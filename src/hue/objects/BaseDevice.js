class BaseDevice {

    _deviceID = undefined;
    _templateType = undefined;
    _name = undefined;
    _uniqueID = undefined;

    constructor(parameters, metadata) {

        for (let property in metadata.properties) {

            const typeDescription = metadata.properties[property];

            switch (typeDescription.type) {
                case "boolean":
                    this[`_${property}`] = false;
                    break;
                default:
            }
            
        }

        this._deviceID = parameters.deviceID;
        this._templateType = parameters.templateType;
        this._name = parameters.name;
        this._uniqueID = parameters.uniqueID;
    }

    /**
     * get deviceID
     */
    getDeviceID() {
        return this._deviceID;
    }

    /**
     * get templateType
     */
    getTemplateType() {
        return this._templateType;
    }

    /**
     * get name
     */
    getName() {
        return this._name;
    }

    /**
     * get uniqueID
     */
    getUniqueID() {
        return this._uniqueID;
    }

    /**
     * set state to value 
     * @param {string} state 
     * @param {any} value 
     */
    setState(state, value) {

        const propertyName = `_${state}`

        if (this.hasOwnProperty(propertyName)) {
            this[propertyName] = value;
            return true;
        } else {
            return false;
        }

    }

    /**
     * get value of state
     * @param {string} state 
     */
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