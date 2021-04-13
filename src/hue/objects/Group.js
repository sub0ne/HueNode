class Group {

    static metadata = {
        properties: {
            on: {type: "boolean"}
        }
    };

    constructor(parameters) {

        for (let property in Group.metadata.properties) {

            const typeDescription = Group.metadata.properties[property];

            switch (typeDescription.type) {
                case "boolean":
                    this[`_${property}`] = false;
                    break;
                default:
            }
            
        }

        this._groupID = parameters.groupID;
        this._type = parameters.type;
        this._name = parameters.name;
        this._lights = parameters.lights;
        this._class = parameters.class;
    }

    
    /**
     * get groupID
     */
     getGroupID() {
        return this._groupID;
    }

    getType() {
        return this._type;
    }

    getName() {
        return this._name;
    }

    getLights() {
        return this._lights;
    }

    getClass() {
        return this._class;
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

module.exports = Group;