const URLParser = require('./URLParser.js');
const Users = require ('../api/Users.js');

const PATTERN_API = "/api";

const handlePost = (request, response) => {

    const url = request.url;

    global.getHueNodeService().Logger.info(`[Hue Emulator] HTTP-Request (POST) received: ${url}`);    

    if (URLParser.matchesPattern(url, PATTERN_API)) {

        const responseData = Users.createUser();        

        response.status(200);
        response.type('application/json');
        response.send(responseData);   
            
    } else {

        response.status(404);
        response.send();

        global.getHueNodeService().Logger.info(`[Hue Emulator] No handler found for HTTP-Request (POST): ${url}`);
    }

}

exports.handlePost = handlePost;