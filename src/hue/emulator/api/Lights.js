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
                lights[deviceID] = this._mapDeviceToResponse(device);
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
            return this._mapDeviceToResponse(lightDevice);
        } else {
            //TODO 
            return "";
        }

    }

    static setState(deviceID, states) {

        const hue = global.getHueNodeService().getHue();
        const lightDevice = hue.getLight(deviceID);

        console.log(states);

        

               
        /*const response = [
                {
                    "success": {
                        "/lights/2/state/on": state
                    }
                }
            ];*/ 
    }

    static _mapDeviceToResponse(device) {

        const hueNodeService = global.getHueNodeService();

        const deviceTemplateFilePath = this._getDeviceTemplateFilePath(device.getTemplateType());

        hueNodeService.Logger.info(`[Hue API Lights] Loading device template for '${device.getTemplateType()}': ${deviceTemplateFilePath}`);
        
        let template = fs.readFileSync(deviceTemplateFilePath, "utf8");
     
        const parameters = {
            on: device.getStateOn(),
            name: device.getName(),
            uniqueID: device.getUniqueID()
        }

        return hueNodeService.getTemplateProcessor().setParameters(template, parameters);

    }

    static _getDeviceTemplateFilePath(deviceType) {
        const templateFileName = `${deviceType.replace(/\s/gm, "_")}.json`;
        return path.join(APP_ROOT, "templates", "devices", templateFileName);
    }

}

module.exports = Lights;