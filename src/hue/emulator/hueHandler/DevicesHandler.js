const BaseHandler = require('./BaseHandler');

const fs = require('fs');
const path = require('path');
const Light = require('../../objects/Light.js');

const DEVICES_FILE = "Devices.json";

class DevicesHandler extends BaseHandler{

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
     * load devices from '<APP_ROOT>/data/Devices.json'
     */
    loadDevices() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Loading devices`);

        let updateDevices = false;

        // if '<APP_ROOT>/data/Devices.json' does not exist, create a new one
        let devices = this._readDevices();
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
    _readDevices() {
        if (fs.existsSync(this._getDevicesFilePath())) {
            return JSON.parse(fs.readFileSync(this._getDevicesFilePath(), "utf8"));
        }
    }


    /**
     * get '<APP_ROOT>/data/Devices.json' path
     */
    _getDevicesFilePath() {
        return path.join(this._getDataFolderPath(), DEVICES_FILE);
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
     * @param {string} encodedDeviceID 
     * @param {string} deviceName 
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



}

module.exports = DevicesHandler;