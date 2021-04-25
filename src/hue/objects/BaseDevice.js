class BaseDevice {

    _deviceID = undefined;
    _templateType = undefined;
    _name = undefined;
    _uniqueID = undefined;

    constructor(parameters, metadata) {

        for (let property in metadata.properties) {

            const typeDescription = metadata.properties[property];

            this[`_${property}`] = typeDescription.defaultValue;

        }

        this._deviceID = parameters.deviceID;
        this._templateType = parameters.templateType;
        this._name = parameters.name;
        this._uniqueID = parameters.uniqueID;

        this._stateChangeHandler = parameters.stateChangeHandler;

        this._metadata = metadata;

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
            this._executeStateChangeHandler(state, value);
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

    /**
     * execute registered state change handler
     */
    _executeStateChangeHandler(state, value) {

        if (!this._stateChangeHandler) {
            return;
        }

        const definedHandler = this._stateChangeHandler[state];

        if (!definedHandler) {
            return;
        }

        definedHandler.forEach(definition => {

            global.getHueNodeService().Logger.info(`[Hue Device] Executing Handler '${definition.type}'.`);

            try {
                const handler = require(`../emulator/stateChangeHandler/${definition.type}`);
                handler.stateChanged(this, state, value, definition);
            } catch (ex) {
                global.getHueNodeService().Logger.info(`[Hue Device] Handler '${definition.type}' not executed.`);
            }

        });

    }

    /**
     * get light parameters
     */
    getParameters() {

        const parameters = {};

        for (let property in this._metadata.properties) {

            parameters[property] = this.getState(property);

        }

        return parameters;
    }
}

module.exports = BaseDevice;