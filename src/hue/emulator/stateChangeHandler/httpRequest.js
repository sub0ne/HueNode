const http = require('http');

const StateChangeHandler = {

    stateChanged(device, state, value, parameters) {

        global.getHueNodeService().Logger.info(`[httpRequest State Handler] httpRequest State Changed Handler executed, state '${state}', value '${value}'`);

        let url = '';

        switch (state) {

            case 'on':
                url = this._processOn(state, value, parameters);
                break;
            case 'bri':
                url = this._processBri(state, value, parameters);
                break;
            case 'ct':
                url = this._processCt(state, value, parameters);
                break;
            case 'xy':
                url = this._processXy(state, value, parameters);
                break;
            default:
                global.getHueNodeService().Logger.info(`[httpRequest State Handler] State '${state}' not processed`);
        }

        if (url) {
            this._sendRequest(url);
        }

    },

    _processState(state, value, parameters) {
        return parameters.url.replace(`{${state}}`, value);
    },

    _processOn(state, value, parameters) {
        return this._processState(state, value, parameters);
    },

    _processBri(state, value, parameters) {
        return this._processState(state, value, parameters);
    },

    _processCt(state, value, parameters) {
        return this._processState(state, value, parameters);
    },

    _processXy(state, value, parameters) {
        return this._processState(state, value, parameters);
    },

    _sendRequest(url) {
        global.getHueNodeService().Logger.info(`[httpRequest State Handler] sending request to '${url}'`);
        http.get(url);
    }

}

module.exports = StateChangeHandler;