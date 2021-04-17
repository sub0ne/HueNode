const BaseHandler = require('./BaseHandler');

const fs = require('fs');
const path = require('path');
const Group = require('../../objects/Group.js');

const GROUPS_FILE = "Groups.json";

class GroupHandler extends BaseHandler {

    /**
     * read groups from Groups.json
     */
    _readGroups() {
        if (fs.existsSync(this._getGroupsFilePath())) {
            return JSON.parse(fs.readFileSync(this._getGroupsFilePath(), "utf8"));
        }
    }

    /**
     * get path for Groups.json
     */
    _getGroupsFilePath() {
        return path.join(this._getDataFolderPath(), GROUPS_FILE);
    }

    /**
     * create group objects from Groups.json
     */
    _createGroups(groups) {

        if (!groups) {
            return;
        }

        let groupsUpdated = false;

        this._groups = groups.reduce((groups, group) => {

            groups[group.groupID] = new Group(group);

            return groups;
        }, {});

        return groupsUpdated;

    }

    /**
     * get groups
     */
    getGroups() {
        return this._groups;
    }

    /**
     * get group for 'groupID'
     */
    getGroup(groupID) {
        return this._groups[groupID];
    }

    /**
     * save groups
     */
    _saveGroups(groups) {
        global.getHueNodeService().Logger.info(`[Hue Emulator] Updating group file: ${this._getGroupsFilePath()}`);

        const data = new Uint8Array(Buffer.from(JSON.stringify(groups, null, 1)));

        fs.writeFile(this._getGroupsFilePath(), data, () => { });
    }

    /**
     * load groups
     */
    loadGroups() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Loading groups`);

        let updateGroups = false;

        // if '<APP_ROOT>/data/Devices.json' does not exist, create a new one
        let groups = this._readGroups();;
        if (!groups) {
            groups = {};
            updateGroups = true;
        }

        // load lights
        updateGroups = this._createGroups(groups.groups) || updateGroups;

        // save updated '<APP_ROOT>/data/Devices.json'
        if (updateGroups) {
            this._saveGroups(groups);
        }

    }


}

module.exports = GroupHandler;