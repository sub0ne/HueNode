const Description = require('../api/Description.js');
const Config = require('../api/Config.js');
const Lights = require('../api/Lights.js');
const Groups = require('../api/Groups.js');
const Users = require('../api/Users.js');
const URLParser = require('./URLParser.js');

const PATTERN_DESCRIPTION = "/description.xml";
const PATTERN_CONFIG = "/api/:username/config";
const PATTERN_USERNAME = "/api/:username";
const PATTERN_LIGHTS = "/api/:username/lights";
const PATTERN_LIGHT = "/api/:username/lights/:deviceID";
const PATTERN_GROUPS = "/api/:username/groups";
const PATTERN_GROUP = "/api/:username/groups/:groupID"
/**
 * handle GET
 */
const handleGet = (request, response) => {

    const url = request.url;
    const protocol = request.protocol.toUpperCase();

    global.getHueNodeService().Logger.info(`[Hue Emulator] ${protocol}-Request (GET) received: ${url}`);

    // /description.xml
    if (URLParser.matchesPattern(url, PATTERN_DESCRIPTION)) {

        const responseData = Description.getSerializedDescription();

        response.status(200);
        response.type('application/xml');
        response.send(responseData);

        // /api/:username/config
    } else if (URLParser.matchesPattern(url, PATTERN_CONFIG)) {

        const responseData = Config.getJSONConfig();

        response.status(200);
        response.type('application/json');
        response.send(responseData);

        // /api/:username   
    } else if (URLParser.matchesPattern(url, PATTERN_USERNAME)) {

        // currently username is not further interpreted 
        const parameters = URLParser.getParameters(url, PATTERN_USERNAME);

        const responseData = Users.getUserData();

        response.status(200);
        response.type('application/json');
        response.send(responseData);

        // /api/:username/lights;
    } else if (URLParser.matchesPattern(url, PATTERN_LIGHTS)) {

        const responseData = Lights.getLights();

        response.status(200);
        response.type('application/json');
        response.send(responseData);

        // /api/:username/lights/:deviceID
    } else if (URLParser.matchesPattern(url, PATTERN_LIGHT)) {

        const parameters = URLParser.getParameters(url, PATTERN_LIGHT);
        const deviceID = parameters["deviceID"];

        const responseData = Lights.getLight(deviceID);

        response.status(200);
        response.type('application/json');
        response.send(responseData);

        // /api/:username/groups;
    } else if (URLParser.matchesPattern(url, PATTERN_GROUPS)) {

        const responseData = Groups.getGroups();

        response.status(200);
        response.type('application/json');
        response.send(responseData);

        // /api/:username/groups/:groupID
    } else if (URLParser.matchesPattern(url, PATTERN_GROUP)) {

        const parameters = URLParser.getParameters(url, PATTERN_GROUP);
        const groupID = parameters["groupID"];

        const responseData = Groups.getGroup(groupID);

        response.status(200);
        response.type('application/json');
        response.send(responseData);

        // no handler found for request
    } else {

        response.status(404);
        response.send();

        global.getHueNodeService().Logger.info(`[Hue Emulator] No handler found for ${protocol}-Request (GET): ${request.url}`);
    }

}

exports.handleGet = handleGet;