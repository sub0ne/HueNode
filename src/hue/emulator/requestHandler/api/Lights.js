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
                lights[deviceID] = this._getDeviceDescription(device);
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
            return this._getDeviceDescription(lightDevice);
        } else {
            global.getHueNodeService().Logger.error(`[Hue API Lights] Light with ID '${deviceID}' not found`);
            throw new Error();
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

        for (let state in states) {

            // get the value
            const value = states[state];
            
            // set state at object and create reponse
            const result = {};
            if (lightDevice.setState(state, value)) {                
                result[`/lights/${deviceID}/state/${state}`] = value;     
                responses.push({success: result});
            }

        };

        return responses;

    }

    /**
     * create JSON description of a device using a json template.
     * The template is specified by the templateType parameter in 'Devices.json'
     * 
     * @param {Object} device 
     */
    static _getDeviceDescription(device) {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Hue API Lights] Get device template for '${device.getTemplateType()}'`);
             
        // set parameters for template
        const parameters = {
            ...device.getParameters(),
            name: device.getName(),
            uniqueID: device.getUniqueID()
        }

        return hueNodeService.getTemplateProcessor().getObjectDescription(device.getTemplateType(), parameters);

    }


}

module.exports = Lights;