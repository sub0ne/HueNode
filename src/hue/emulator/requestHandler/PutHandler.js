let state = false;

const handlePut = (request, response) => {

    global.getHueNodeService().getLogger().info(`[Hue Emulator] HTTP-Request (PUT) received: ${request.url}`);    

    switch (request.url) {

        case '/api/burgestrand/lights/2/state':

            state = !state;

            const response = [
                {
                    "success": {
                        "/lights/2/state/on": state
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

exports.handlePut = handlePut;