const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const HueServer = require('./HueServer.js');
const Light = require('../device/Light.js');
const Group = require('../device/Group.js');

const APP_ROOT = path.dirname(require.main.filename);
const DATA_FOLDER = "data";
const DEVICES_FILE = "Devices.json";
const GROUPS_FILE = "Groups.json";


class Hue {

    _hueServer = undefined;
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

        this._loadDevices();
        this._loadGroups();

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
     * get all lights
     */
    getLights() {
        return this._lights;
    }

    /**
     * get light by deviceID
     * @param {string} deviceID 
     */
    getLight(deviceID) {
        return this._lights[deviceID];
    }

    /**
     * load devices from '<APP_ROOT>/data/Devices.json'
     */
    _loadDevices() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Loading devices`);

        let updateDevices = false;

        // if '<APP_ROOT>/data/Devices.json' does not exist, create a new one
        let devices = this._getJSONDevices();
        if (!devices) {
            devices = {};
            updateDevices = true;
        }

        // load lights
        updateDevices = this._createLights(devices.lights) || updateDevices;

        // save updated '<APP_ROOT>/data/Devices.json'
        if (updateDevices) {
            this._saveDevices(devices);
        }

    }

    /**
     * read and parse '<APP_ROOT>/data/Devices.json'
     */
    _getJSONDevices() {
        if (fs.existsSync(this._getDevicesFilePath())) {
            return JSON.parse(fs.readFileSync(this._getDevicesFilePath(), "utf8"));
        }
    }

    /**
     * save devices to '<APP_ROOT>/data/Devices.json'
     * @param {*} devices 
     */
    _saveDevices(devices) {
        global.getHueNodeService().Logger.info(`[Hue Emulator] Updating device file: ${this._getDevicesFilePath()}`);

        const data = new Uint8Array(Buffer.from(JSON.stringify(devices, null, 1)));

        fs.writeFile(this._getDevicesFilePath(), data, () => { });
    }

    /**
     * create light objects from '<APP_ROOT>/data/Devices.json' definition
     * @param {Object[]} lights 
     */
    _createLights(lights) {

        if (!lights) {
            return;
        }

        let deviceUpdated = false;

        this._lights = lights.reduce((lights, light) => {
            if (!light.uniqueID) {
                light.uniqueID = this._generateUniqueID(light.deviceID, light.name);
                deviceUpdated = true;
            }

            lights[light.deviceID] = new Light(light);

            return lights;
        }, {});

        return deviceUpdated;

    }

    /**
     * get '<APP_ROOT>/data/' path
     */
    _getDataFolderPath() {
        return path.join(APP_ROOT, DATA_FOLDER);
    }

    /**
    * get '<APP_ROOT>/data/Devices.json' path
    */
    _getDevicesFilePath() {
        return path.join(this._getDataFolderPath(), DEVICES_FILE);
    }

    /**
     * create a device uniqueID based on deviceID and deviceName
     * @param {string} deviceID 
     * @param {string} deviceName 
     */
    _generateUniqueID(deviceID, deviceName) {

        const encryptedDeviceID = this._encodeDeviceID(deviceID, deviceName);

        const keySegments = [];

        for (let i = 0; i <= 7; i++) {
            keySegments.push(encryptedDeviceID.substring(i * 2, i * 2 + 2));
        }

        return `${keySegments.join(":")}-01`;

    }

    /**
     * derive uniqueID from deviceID and deviceName using tripleDES
     * @param {string} deviceID 
     * @param {string} key 
     */
    _encodeDeviceID(deviceID, deviceName) {

        // create hex key from deviceName
        const keyHex = CryptoJS.enc.Utf8.parse(deviceName);

        // encrypt deviceID
        const encrypted = CryptoJS.TripleDES.encrypt(deviceID, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        // stringify the encrypted deviceID
        const encryptedDeviceID = CryptoJS.enc.Hex.stringify(encrypted.ciphertext).toUpperCase();

        return encryptedDeviceID;
    }

    /**
     * decrypt deviceID from encoded string (CURRENTLY NOT USED)
     * @param {*} encodedDeviceID 
     * @param {*} deviceName 
     */
    _decodeDeviceID(encodedDeviceID, deviceName) {
        const keyHex = CryptoJS.enc.Utf8.parse(deviceName);

        const decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(encodedDeviceID)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);

    }


    _loadGroups() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Loading groups`);

        let updateGroups = false;

        // if '<APP_ROOT>/data/Devices.json' does not exist, create a new one
        let groups = this._getJSONGroups();;
        if (!groups) {
            groups = {};
            updateDevices = true;
        }

        // load lights
        updateGroups = this._createGroups(groups.groups) || updateGroups;

        // save updated '<APP_ROOT>/data/Devices.json'
        if (updateGroups) {
            this._saveGroups(groups);
        }

    }


    _getJSONGroups() {
        if (fs.existsSync(this._getGroupsFilePath())) {
            return JSON.parse(fs.readFileSync(this._getGroupsFilePath(), "utf8"));
        }
    }


    _getGroupsFilePath() {
        return path.join(this._getDataFolderPath(), GROUPS_FILE);
    }


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


    getGroups() {
        return this._groups;
    }


    getGroup(groupID) {
        return this._groups[groupID];
    }

}

module.exports = Hue;