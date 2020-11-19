const URLParser = require('./URLParser.js');

const handlePost = (request, response) => {

    const url = request.url;

    global.getHueNodeService().Logger.info(`[Hue Emulator] HTTP-Request (DELETE) received: ${url}`);    

    response.status(404);
    response.send();

    global.getHueNodeService().Logger.info(`[Hue Emulator] No handler found for HTTP-Request (DELETE): ${url}`);    

}

exports.handlePost = handlePost;