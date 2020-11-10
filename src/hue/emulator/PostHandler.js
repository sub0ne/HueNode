const Logger = require('../../Logger.js');

const handlePost = (request, response) => {

    Logger.getLogger().info(`[Hue Emulator] HTTP-Request (POST) received: ${request.url}`);    

    switch (request.url) {

        case '/api':

            const response = [
                {
                    "success": {
                        "username": "burgestrand"
                    }
                }
            ];

            response.status(200);
            response.type('application/json');
            response.send(response);

            break;

        default:
            break;
    }

}

exports.handlePost = handlePost;