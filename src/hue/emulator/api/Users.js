const { v4: uuidv4 } = require('uuid');
const Config = require('./Config.js');
const Lights = require('./Lights.js');
const Sensors = require('./Sensors.js');
const Groups = require('./Groups.js');

class Users {

    static createUser() {

        const uuid = uuidv4();
        const username = uuid.replace(/-/g, '');

        return [{
            "success": {
                "username": username
            }
        }]; 

    }

    static getUserData() {

        const responseData = {
            lights: Lights.getLights(),
            scenes: {},
            groups: Groups.getGroups(),
            schedules: {},
            sensors: Sensors.getSensors(),
            rules: {}
        }

        responseData.config = Config.getConfig();

        return responseData;

    }
    
}

module.exports = Users;