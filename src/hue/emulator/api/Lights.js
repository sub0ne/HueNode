const fs = require('fs');
const path = require('path');

const APP_ROOT = path.dirname(require.main.filename);

class Lights {

    /**
     * get all lights
     */
    static getLights() {

        const hue = global.getHueNodeService().getHue();
        const devices = hue.getLights();

        const lights = {};

        Object.values(devices).forEach(device => {

            const deviceID = device.getDeviceID();

            if (!lights[deviceID])  {
                lights[deviceID] = this._getJSONDeviceDescription(device);
            } else {
                global.getHueNodeService().Logger.info(`[Hue Emulator] Duplicate device ID detected: ${deviceID}`);    
            }        
        });

        return lights;
    }

    /**
     * get light by deviceID
     * @param {string} deviceID 
     */
    static getLight(deviceID) {

        const hue = global.getHueNodeService().getHue();
        const lightDevice = hue.getLight(deviceID);

        if (lightDevice) {
            return this._getJSONDeviceDescription(lightDevice);
        } else {
            //TODO 
            return "";
        }

    }

    /**
     * set state
     * @param {string} deviceID 
     * @param {string} states 
     */
    static setState(deviceID, states) {

        const hue = global.getHueNodeService().getHue();
        const lightDevice = hue.getLight(deviceID);

        const responses = [];

        Object.keys(states).forEach(state => {

            // get the value
            const value = states[state];
            
            // set state at object and create reponse
            const result = {};
            if (lightDevice.setState(state, value)) {                
                result[`/lights/${deviceID}/state/${state}`] = value;     
                responses.push({success: result});
            }

        });

        return responses;

    }

    /**
     * create JSON description of a device using a json template.
     * The template is specified by the templateType parameter in 'Devices.json'
     * 
     * @param {Object} device 
     */
    static _getJSONDeviceDescription(device) {

        const hueNodeService = global.getHueNodeService();

        const deviceTemplateFilePath = this._getDeviceTemplateFilePath(device.getTemplateType());

        hueNodeService.Logger.info(`[Hue API Lights] Loading device template for '${device.getTemplateType()}': ${deviceTemplateFilePath}`);
        
        let template = fs.readFileSync(deviceTemplateFilePath, "utf8");
     
        // set parameters for template
        const parameters = {
            on: device.getState("on"),
            name: device.getName(),
            uniqueID: device.getUniqueID()
        }

        return JSON.parse(hueNodeService.getTemplateProcessor().setParameters(template, parameters));

    }

    /**
     * get device template path '<APP_ROOT>/templates/devices/<templateType>'
     * @param {string} deviceType 
     */
    static _getDeviceTemplateFilePath(deviceType) {
        const templateFileName = `${deviceType.replace(/\s/gm, "_")}.json`;
        return path.join(APP_ROOT, "templates", "devices", templateFileName);
    }

}

module.exports = Lights;