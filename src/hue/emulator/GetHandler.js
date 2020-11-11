const Logger = require('../../Logger.js');
const HueConfiguration = require('../configuration/HueConfiguration.js');

let state = false;

const handleGet = (request, response) => {

    Logger.getLogger().info(`[Hue Emulator] HTTP-Request (GET) received: ${request.url}`);    

    if (request.url === '/description.xml') {
        
        const hueConfiguration = new HueConfiguration();
        const responseData = hueConfiguration.getHueBridgeDescription();

        response.status(200);
        response.type('application/xml');
        response.send(responseData);

    } else if (request.url.endsWith('/api/nouser/config')) {

        const hueConfiguration = new HueConfiguration();
        const responseData = hueConfiguration.getNoUserConfig();

        response.status(200);
        response.type('application/json');
        response.send(responseData);  
        
    } else if (request.url.endsWith('/api/burgestrand')) { // TODO user specific parsing

        const hueConfiguration = new HueConfiguration();

        const responseData = {
            lights: {},
            scenes: {},
            groups: {},
            schedules: {},
            sensors: {},
            rules: {}
        }

        responseData. config = JSON.parse(hueConfiguration.getNoUserConfig());

        response.status(200);
        response.type('application/json');
        response.send(responseData);  

    } else if (request.url.endsWith('/lights')) {

        const responseData = {
            2: {
                "state": {
                    "on": state,
                    "alert": "select",
                    "reachable": true
                },
                "swupdate": {
                    "state": "notupdatable",
                    "lastinstall": "2020-11-05T18:37:08"
                },
                "type": "Dimmable light",
                "name": "On/Off plug 2",
                "modelid": "SP 120",
                "manufacturername": "innr",
                "productname": "On/Off plug",
                "capabilities": {
                    "certified": false,
                    "control": {
                    },
                    "streaming": {
                        "renderer": false,
                        "proxy": false
                    }
                },
                "config": {
                    "archetype": "classicbulb",
                    "function": "functional",
                    "direction": "omnidirectional"
                },
                "uniqueid": "00:15:8d:00:03:88:60:68-22",
                "swversion": "2.0"
            }
        };

        response.status(200);
        response.type('application/json');
        response.send(responseData);

    } else if (request.url.endsWith('/lights/2')) {

        const responseData = {
            "state": {
                "on": state,
                "alert": "select",
                "reachable": true
            },
            "swupdate": {
                "state": "notupdatable",
                "lastinstall": "2020-11-05T18:37:08"
            },
            "type": "Dimmable light",
            "name": "On/Off plug 2",
            "modelid": "SP 120",
            "manufacturername": "innr",
            "productname": "On/Off plug",
            "capabilities": {
                "certified": false,
                "control": {},
                "streaming": {
                    "renderer": false,
                    "proxy": false
                }
            },
            "config": {
                "archetype": "classicbulb",
                "function": "functional",
                "direction": "omnidirectional"
            },
            "uniqueid": "00:15:8d:00:03:88:60:68-22",
            "swversion": "2.0"
        };

        response.status(200);
        response.type('application/json');
        response.send(responseData);

    } else {
        Logger.getLogger().info(`[Hue Emulator] No handler found for HTTP-Request (GET): ${request.url}`);    
    }

}

exports.handleGet = handleGet;