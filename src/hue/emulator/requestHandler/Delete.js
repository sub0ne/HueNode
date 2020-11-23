const URLParser = require('./URLParser.js');

const handlePost = (request, response) => {

    const url = request.url;
    const protocol = request.protocol.toUpperCase();

    global.getHueNodeService().Logger.info(`[Hue Emulator] ${protocol}-Request (DELETE) received: ${url}`);    

    response.status(404);
    response.send();

    global.getHueNodeService().Logger.info(`[Hue Emulator] No handler found for ${protocol}-Request (DELETE): ${url}`);    

}

exports.handlePost = handlePost;