const DevicesHandler = require('./hueHandler/DevicesHandler.js');
const GroupHandler = require('./hueHandler/GroupHandler.js');
const HueServer = require('./HueServer.js');

class Hue {

    _hueServer = undefined;
    _devicesHandler = undefined;
    _groupHandler = undefined;

    _lights = {};
    _groups = {};

    constructor() {
    }

    /**
     * stop hue emulator
     */
    stopHue() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Stopped`);

        if (this._hueServer && this._hueServer.isRunning()) {
            this._hueServer.stopServer();
        }

    }

    /**
     * start hue emulator
     */
    async startHue() {

        this._getDevicesHandler().loadDevices();
        this._getGroupHandler().loadGroups();

        global.getHueNodeService().Logger.info(`[Hue Emulator] Starting`);

        // instantiiate http/https server
        if (!this._hueServer) {
            this._hueServer = new HueServer();
        }

        if (!this._hueServer.isRunning()) {
            this._hueServer.startServer();
        }

    }

    /**
     * get device handler instance
     */
    _getDevicesHandler() {

        if (!this._devicesHandler) {
            this._devicesHandler = new DevicesHandler();
        }

        return this._devicesHandler;
    }

    /**
     * get group handler instance
     */
    _getGroupHandler() {

        if (!this._groupHandler) {
            this._groupHandler = new GroupHandler();
        }

        return this._groupHandler;
    }

    /**
     * get light with id 'deviceID'
     */
    getLight(deviceID) {
        return this._getDevicesHandler().getLight(deviceID);
    }

    /**
     * get all lights
     */
    getLights() {
        return this._getDevicesHandler().getLights();
    }

    /**
     * get group with 'groupID'
     */

    getGroup(groupID) {
        return this._getGroupHandler().getGroup(groupID);
    }

    /**
     * get all groups
     */
    getGroups() {
        return this._getGroupHandler().getGroups();
    }

}

module.exports = Hue;