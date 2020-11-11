const Logger = require('../../Logger.js');

const handlePost = (request, response) => {

    Logger.getLogger().info(`[Hue Emulator] HTTP-Request (POST) received: ${request.url}`);    

    if (request.url === '/api'|| request.url === '/api/') {
 
        const responseData = [
            {
                "success": {
                    "username": "burgestrand"
                }
            }
        ];

        response.status(200);
        response.type('application/json');
        response.send(responseData);   
            
    }

}

exports.handlePost = handlePost;