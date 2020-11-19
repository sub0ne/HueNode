class Lights {

    static getLights() {

        const hue = global.getHueNodeService().getHue();
        const devices = hue.getLights();

        const lights = {};

        Object.values(devices).forEach(device => {

            const deviceID = device.getDeviceID();

            if (!lights[deviceID])  {
                lights[device] = _lightToJSON(device);
            } else {
                global.getHueNodeService().Logger.info(`[Hue Emulator] Duplicate device ID detected: ${deviceID}`);    
            }        
        });

        return {};
    }

    static getLight(deviceID) {

        const hue = global.getHueNodeService().getHue();
        const lightDevice = hue.getLight(deviceID);

        
    }

    static setState(deviceID, states) {
           
        /*const response = [
                {
                    "success": {
                        "/lights/2/state/on": state
                    }
                }
            ];*/ 
    }

    static _lightToJSON(lightDevice) {

    }

}

module.exports = Lights;