const fs = require('fs');
const path = require('path');
const CryptoJS = require ('crypto-js');
const HueServer = require('./HueServer.js');
const Light = require('../device/Light.js');

const APP_ROOT = path.dirname(require.main.filename);
const DATA_FOLDER = "data";
const DEVICES_FILE = "Devices.json";

class Hue {

    _hueServer = undefined;
    _lights = {};

    constructor() {
    }

    stopHue() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Stop Hue`);

        if (this._hueServer && this._hueServer.isRunning()) {
            this._hueServer.stopServer();
        }

    }

    startHue() {

        this._loadDevices();

        global.getHueNodeService().Logger.info(`[Hue Emulator] Start Hue`);

        if (!this._hueServer) {
            this._hueServer = new HueServer();
        }

        if (!this._hueServer.isRunning()) {
            this._hueServer.startServer();
        }

    }

    getLights() {
        return this._lights;
    }

    getLight(deviceID) {
        return this._lights[deviceID];
    }

    _loadDevices() {

        global.getHueNodeService().Logger.info(`[Hue Emulator] Loading devices`);

        const devices = JSON.parse(fs.readFileSync(this._getDevicesFilePath(), "utf8"));

        let updateDevices = false;

        updateDevices = this._loadLights(devices.lights);

        if (updateDevices) {
            this._saveDevices(devices);
        }
    }

    _saveDevices(devices) {
        global.getHueNodeService().Logger.info(`[Hue Emulator] Updating device file: ${this._getDevicesFilePath()}`);

        const data = new Uint8Array(Buffer.from(JSON.stringify(devices, null, 1)));
        
        fs.writeFile(this._getDevicesFilePath(), data, () => {});
    }

    _loadLights(lights) {

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

    _getDataFolderPath() {
        return path.join(APP_ROOT, DATA_FOLDER);
    }

    _getDevicesFilePath() {
        return path.join(this._getDataFolderPath(), DEVICES_FILE);
    }

    _generateUniqueID(deviceID, deviceName) {

        const encryptedDeviceID = this._encodeDeviceID(deviceID, deviceName);

        const keySegments = [];

        for (let i = 0; i <= 7; i++) {
            keySegments.push(encryptedDeviceID.substring(i*2, i*2 + 2));
        }
              
        return `${keySegments.join(":")}-01`;
      
    }

    _encodeDeviceID(deviceID, key){

        const keyHex = CryptoJS.enc.Utf8.parse(key);
      
        const encrypted = CryptoJS.TripleDES.encrypt(deviceID, keyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
      
        const encryptedDeviceID = CryptoJS.enc.Hex.stringify(encrypted.ciphertext).toUpperCase();
      
        return encryptedDeviceID;
    }

    _decodeDeviceID(encodedDeviceID, key) {
        const keyHex = CryptoJS.enc.Utf8.parse(key);
      
        const decrypted = CryptoJS.TripleDES.decrypt({
          ciphertext: CryptoJS.enc.Hex.parse(encodedDeviceID)}, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
      
        return decrypted.toString(CryptoJS.enc.Utf8);
      
    }

}

module.exports = Hue;