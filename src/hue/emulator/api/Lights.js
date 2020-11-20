const fs = require('fs');
const path = require('path');

const APP_ROOT = path.dirname(require.main.filename);

class Lights {

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

    static setState(deviceID, states) {

        const hue = global.getHueNodeService().getHue();
        const lightDevice = hue.getLight(deviceID);

        const responses = [];

        Object.keys(states).forEach(state => {
            const value = states[state];
            
            const result = {};
            if (lightDevice.setState(state, value)) {                
                result[`/lights/${deviceID}/state/${state}`] = value;     
                responses.push({success: result});
            }

        });

        return responses;

    }

    static _getJSONDeviceDescription(device) {

        const hueNodeService = global.getHueNodeService();

        const deviceTemplateFilePath = this._getDeviceTemplateFilePath(device.getTemplateType());

        hueNodeService.Logger.info(`[Hue API Lights] Loading device template for '${device.getTemplateType()}': ${deviceTemplateFilePath}`);
        
        let template = fs.readFileSync(deviceTemplateFilePath, "utf8");
     
        const parameters = {
            on: device.getState("on"),
            name: device.getName(),
            uniqueID: device.getUniqueID()
        }

        return JSON.parse(hueNodeService.getTemplateProcessor().setParameters(template, parameters));

    }

    static _getDeviceTemplateFilePath(deviceType) {
        const templateFileName = `${deviceType.replace(/\s/gm, "_")}.json`;
        return path.join(APP_ROOT, "templates", "devices", templateFileName);
    }

}

module.exports = Lights;