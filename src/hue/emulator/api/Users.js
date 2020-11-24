const { v4: uuidv4 } = require('uuid');
const Config = require('./Config.js');
const Lights = require('./Lights.js');
const Sensors = require('./Sensors.js');
const Groups = require('./Groups.js');

class Users {

    /**
     * create a new api user 
     */
    static createUser() {

        // use uuidv4 as api user
        const uuid = uuidv4();
        const username = uuid.replace(/-/g, '');

        return [{
            "success": {
                "username": username
            }
        }]; 

    }

    /**
     * get user data
     */
    static getUserData() {

        // get all necessary objects
        const responseData = {
            lights: Lights.getLights(),
            scenes: {},
            groups: Groups.getGroups(),
            schedules: {},
            sensors: Sensors.getSensors(),
            rules: {}
        }

        // add 'nouser_config.json'
        responseData.config = Config.getJSONConfig();

        return responseData;

    }
    
}

module.exports = Users;