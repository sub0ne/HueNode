const fs = require('fs');
const path = require('path');

const APP_ROOT = path.dirname(require.main.filename);

class Groups {

    /**
     * get all groups
     */
    static getGroups() {

        const hue = global.getHueNodeService().getHue();
        const groups = hue.getGroups();

        const result = {};

        Object.values(groups).forEach(group => {

            const groupID = group.getGroupID();

            if (!result[groupID]) {
                result[groupID] = this._getJSONGroupDescription(group);
            } else {
                global.getHueNodeService().Logger.info(`[Hue Emulator] Duplicate group ID detected: ${groupID}`);
            }
        });

        return result;

    }


    
    /**
     * get light by deviceID
     * @param {string} deviceID 
     */
     static getGroup(groupID) {

        const hue = global.getHueNodeService().getHue();
        const group = hue.getGroup(groupID);

        if (group) {
            return this._getJSONGroupDescription(group);
        } else {
            global.getHueNodeService().Logger.error(`[Hue API Groups] Group with ID '${groupID}' not found`);
            throw new Error();
        }

    }


    /**
     * create JSON description of a group using a json template.
     * 
     * @param {Object} group 
     */
    static _getJSONGroupDescription(group) {

        const hueNodeService = global.getHueNodeService();

        const groupTemplateFilePath = this._getGroupTemplateFilePath();

        hueNodeService.Logger.info(`[Hue API Groups] Loading group template for 'group': ${groupTemplateFilePath}`);

        let template = fs.readFileSync(groupTemplateFilePath, "utf8");

        // set parameters for template
        const parameters = {
            on: group.getState("on"),
            lights: JSON.stringify(group.getLights()),
            type: group.getType(),
            class: group.getClass(),
            name: group.getName()
        }

        return JSON.parse(hueNodeService.getTemplateProcessor().setParameters(template, parameters));

    }

    /**
     * get group template path '<APP_ROOT>/templates/objects/group.json'
     */
    static _getGroupTemplateFilePath() {
        return path.join(APP_ROOT, "templates", "objects", "group.json");
    }

}

module.exports = Groups;