const Description = require('../api/Description.js');
const Config = require('../api/Config.js');
const URLParser = require('./URLParser.js');

const handleGet = (request, response) => {

    const url = request.url;

    global.getHueNodeService().Logger.info(`[Hue Emulator] HTTP-Request (GET) received: ${url}`);    

    if (URLParser.matchesPattern(url, "/description.xml")) {
    
        const responseData = Description.getDescription();

        console.log(responseData);

        response.status(200);
        response.type('application/xml');
        response.send(responseData); 

    } else if (URLParser.matchesPattern(url, "/api/:username/config")) {

        const responseData = Config.getConfig();

        response.status(200);
        response.type('application/json');
        response.send(responseData);  

    } else if (URLParser.matchesPattern(url,'/api/:username')) { 
        
        console.log("1");
        const parameters = URLParser.getParameters(url, '/api/:username');
        console.log(parameters);

    } else if (URLParser.matchesPattern(url,'/api/:username/lights')) {

        console.log("2");
        const parameters = URLParser.getParameters(url, '/api/:username/lights');
        console.log(parameters);

    } else if (URLParser.matchesPattern(url,'/api/:username/lights/:deviceID')) {

        console.log("3");
        const parameters = URLParser.getParameters(url, '/api/:username/lights/:deviceID');
        console.log(parameters);

    } else {
        global.getHueNodeService().Logger.info(`[Hue Emulator] No handler found for HTTP-Request (GET): ${request.url}`);    
    }

}

exports.handleGet = handleGet;