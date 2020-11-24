const URLParser = require('./URLParser.js');
const Lights = require('../api/Lights.js');

const PATTERN_LIGHT_STATE = "/api/:username/lights/:deviceID/state";

/**
 * handle PUT
 */
const handlePut = (request, response) => {

    const url = request.url;
    const protocol = request.protocol.toUpperCase();

    global.getHueNodeService().Logger.info(`[Hue Emulator] ${protocol}-Request (PUT) received: ${url}`);    

    // /api/:username/lights/:deviceID/state
    if (URLParser.matchesPattern(url,PATTERN_LIGHT_STATE)) {

        const parameters = URLParser.getParameters(url, PATTERN_LIGHT_STATE);
        const deviceID = parameters["deviceID"];

        const states = request.body;

        global.getHueNodeService().Logger.info(`[Hue Emulator] ${protocol}-Request (PUT) Request body received state changes:'`);
        for (state in states) {
            global.getHueNodeService().Logger.info(`[Hue Emulator] '${state}' --> '${states[state]}'`);
        };

        const responseData = Lights.setState(deviceID, states);
    
        response.status(200);
        response.type('application/json');
        response.send(responseData);

    // no handler found for request
    } else {
        
        response.status(404);
        response.send();

        global.getHueNodeService().Logger.info(`[Hue Emulator] No handler found for ${protocol}-Request (PUT): ${url}`);    
    }

}

exports.handlePut = handlePut;