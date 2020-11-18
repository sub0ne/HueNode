const { v4: uuidv4 } = require('uuid');
const Config = require('./Config.js');

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
            lights: {},
            scenes: {},
            groups: {},
            schedules: {},
            sensors: {},
            rules: {}
        }

        responseData.config = Config.getConfig();                

    }
    
}

module.exports = Users;