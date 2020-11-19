class Light {

    _on = undefined;

    constructor() {
    }

    getStateOn() {
        return this._on;
    }

    setStateOn(on) {
        this._on = on;
    }

}

module.exports = Light;