const fs = require('fs');
const path = require('path');

const HUE_BRIDGE_TEMPLATE_FILE = "HueBridge.xml";
const NOUSER_CONFIG_FILE = "nouser_config.json";
const UPNP_RESPONSE_TEMPLATE_FILE = "UPnPResponse";

class TemplateProcessor {

    constructor() {
    }

    /**
     * get object description
     */
    getObjectDescription(object, parameters) {
     
        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Template Processor] Loading object description '${object}' template: ${this._getObjectTemplateFilePath(object)}`);
      
        const objectTemplateFilePath = this._getObjectTemplateFilePath(object);

        let template = fs.readFileSync(objectTemplateFilePath, "utf8");
        return JSON.parse(this._setParameters(template, parameters));

    }

    /**
     * get the UPnPResponse
     */
    getUPnPResponse(parameters) {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Template Processor] Loading nouser config template: ${this._getNoUserConfigTemplatePath()}`);
        let template = fs.readFileSync(this._getUPnPResponseTemplatePath(), "utf8");

        return this._setParameters(template, parameters);
    }

    /**
     * get the No User Config
     */
    getNoUserConfig(parameters) {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Template Processor] Loading nouser config template: ${this._getNoUserConfigTemplatePath()}`);
        let template = fs.readFileSync(this._getNoUserConfigTemplatePath(), "utf8");

        return JSON.parse(this._setParameters(template, parameters));
    }
 
    /**
     * get Hue Bridge Info
     */
    getHueBridgeInfo(parameters) {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Template Processor] Loading hue bridge template: ${this._getHueBridgeTemplatePath()}`);
        let template = fs.readFileSync(this._getHueBridgeTemplatePath(), "utf8");

        return this._setParameters(template, parameters);
    }

    /**
     * Set the given parameters within the template
     */
    _setParameters(template, parameters) {

        let result = template;

        for (let parameter in parameters) {
            const strRegEx = `\\{${parameter}\\}`;
            const regEx = new RegExp(strRegEx, "g");

            result = result.replace(regEx, parameters[parameter]);
        };

        return result;

    }

    /**
     * get 'object/{object}' template path
     */
    _getObjectTemplateFilePath(object) {
        return path.join(__dirname, "objects", `${object}.json`);
    }


    /**
     * get 'UPnPResponse' template path
     */
    _getUPnPResponseTemplatePath() {
        return path.join(__dirname, UPNP_RESPONSE_TEMPLATE_FILE);
    }


    /**
     * get 'nouser_config.json' template path
     */
    _getNoUserConfigTemplatePath() {
        return path.join(__dirname, NOUSER_CONFIG_FILE);
    }

    /**
     * getter for 'HueBridge.xml' template path
     */
    _getHueBridgeTemplatePath() {
        return path.join(__dirname, HUE_BRIDGE_TEMPLATE_FILE);
    }

}

module.exports = TemplateProcessor;