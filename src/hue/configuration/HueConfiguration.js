const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const determineIPAddress = require('./determineIPAddress.js');

const HUE_BRIDGE_TEMPLATE_FILE = "HueBridge.xml";
const NOUSER_CONFIG_FILE = "nouser_config.json";
const APP_ROOT = path.dirname(require.main.filename);
const DATA_FOLDER = "data";
const HUE_CONFIGURATION_FILE = "Configuration.json";

class HueConfiguration {

    constructor() {         
    }

    /**
     * initialize the HueConfiguration
     */
    initialize() {

        global.getHueNodeService().Logger.info(`[Hue Configuration] Initializing configuration`);

        return Promise.all([
            this._determineIPAddress()
        ]);
    }

    /**
     * try to determine the IP address of the host
     */
    async _determineIPAddress() {
        
        if (!!this.getIPAddress()) {
            global.getHueNodeService().Logger.info(`[Hue Configuration] IP address set to ${this.getIPAddress()} due to 'Configuration.json'`);
            return;
        }

        global.getHueNodeService().Logger.info(`[Hue Configuration] Trying to determine IP address`);

        const ipAddresses = await determineIPAddress.get();

        // if the IP address could not be determined unambiguously throw an exception
        if (ipAddresses.length !== 1) {
            global.getHueNodeService().Logger.info(`[Hue Configuration] IP address could not be determined`);
            throw new Error("IP address could not be determined");
        }
        
        // set the IP address
        this._setIPAddress(ipAddresses[0]);

    }

    /**
     * get the HueBridge Description  ('HueBridge.xml') aka Description.xml as string
     */
    getSerializedHueBridgeDescription() {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Hue Configuration] Loading hue bridge template: ${this._getHueBridgeTemplatePath()}`);
        let template = fs.readFileSync(this._getHueBridgeTemplatePath(), "utf8");

        // set parameters for Description.xml
        const parameters = {
            uuid: this.getUUID(),
            serialNumber: this.getSerialNumber(),
            ipAddress: this.getIPAddress(),
            modelID: this.getModelID()
        }

        return hueNodeService.getTemplateProcessor().setParameters(template, parameters);
    }

    /**
     * get the configuration from 'Configuration.json'
     */
    _getConfiguration() {

        if (!this._configuration) {

            if (!fs.existsSync(this._getDataFolderPath())) {
                global.getHueNodeService().Logger.info(`[Hue Configuration] Create folder 'data'`);
                fs.mkdirSync(this._getDataFolderPath());
            }

            if (fs.existsSync(this._getConfigurationFilePath())) {
                this._loadConfiguration();
            } else {
                this._setupNewConfiguration();
                this._saveConfiguration();
            }
        }

        return this._configuration;

    }

    /**
     * load 'Configuration.json'
     */
    _loadConfiguration() {
        global.getHueNodeService().Logger.info(`[Hue Configuration] Loading configuration file: ${this._getConfigurationFilePath()}`);    

        this._configuration = JSON.parse(fs.readFileSync(this._getConfigurationFilePath()));

    }

    /**
     * save 'Configuration.json'
     */
    _saveConfiguration() {
        global.getHueNodeService().Logger.info(`[Hue Configuration] Save configuration file: ${this._getConfigurationFilePath()}`);

        const data = new Uint8Array(Buffer.from(JSON.stringify(this._configuration, null, 1)));
        
        fs.writeFile(this._getConfigurationFilePath(), data, () => {});

    }

    /**
     * create a new configuration object
     */
    _setupNewConfiguration() {

        global.getHueNodeService().Logger.info(`[Hue Configuration] Create new hue configuration`);    

        // e.g. da339446-ecab-4385-8f61-933ba188f810
        const uuid = uuidv4();;

        // e.g. 933ba188f810
        const serialNumber = uuid.split('-')[4];
        
        this._configuration = {
            name: 'HueNode Hue',
            uuid,
            serialNumber,
            modelID: "BSB002"
        }        
    }

    /**
     * getter for folder '<APP_ROOT>/data'
     */
    _getDataFolderPath() {
        return path.join(APP_ROOT, DATA_FOLDER);
    }

    /**
     * getter for 'Configuration.json' path ('<APP_ROOT>/data/Configuration.json')
     */
    _getConfigurationFilePath() {
         return path.join(this._getDataFolderPath(), HUE_CONFIGURATION_FILE);
    }

    /**
     * getter for 'HueBridge.xml' template path
     */
    _getHueBridgeTemplatePath() {
        return path.join(APP_ROOT, "templates", HUE_BRIDGE_TEMPLATE_FILE);
    }

    /**
     * getter for uuid
     */
    getUUID(){
        return this._getConfiguration().uuid;
    }

    /**
     * getter for serialNumber
     */
    getSerialNumber() {
        return this._getConfiguration().serialNumber;
    }

    /**
     * getter for bridgeID which is derived from serialNumber
     */
    getBridgeID() {

        // e.g. 933ba188f810
        const serialNumber = this.getSerialNumber();

        // e.g. 933ba1fffe88f810
        const bridgeID = serialNumber.substring(0, 6) + "FFFE" + serialNumber.substring(6);
        return bridgeID.toUpperCase();
    }

    /**
     * getter for name
     */
    getName() {
        return this._getConfiguration().name;
    }

    /**
     * getter for mac address which is derived from serialNumber
     */
    getMacAddress() {
 
        // e.g. 933ba188f810
        const serialNumber = this.getSerialNumber().toUpperCase();

        const keySegments = [];

        for (let i = 0; i <= 5; i++) {
            keySegments.push(serialNumber.substring(i*2, i*2 + 2));
        }
             
        // e.g. 93:3b:a1:88:f8:10
        return keySegments.join(":");

    }

    /**
     * getter for ip address
     */
    getIPAddress() {
        return this._getConfiguration().ipAddress;
    }

    /**
     * setter for ip address
     * @param {string} ipAddress 
     */
    _setIPAddress(ipAddress) {
        global.getHueNodeService().Logger.info(`[Hue Configuration] Setting IP address to '${ipAddress}'`);
        this._getConfiguration().ipAddress = ipAddress;
    }

    /**
     * getter for time
     */
    getTime() {
        return {
            localTime: moment().format('YYYY-MM-DTHH:mm:ss'),
            utcTime: moment().utc().format('YYYY-MM-DTHH:mm:ss'),
            timeZone: 'Europe/Berlin'
        }
    }

    /**
     * get 'nouser_config.json' as serialized string
     */
    getSerializedNoUserConfig() {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Hue Configuration] Loading nouser config template: ${this._getNoUserConfigTemplatePath()}`);            
        let template = fs.readFileSync(this._getNoUserConfigTemplatePath(), "utf8");
 
        const time = this.getTime();

        // set parameters for 'nouser_config.json'
        const parameters = {
            name: this.getName(),
            ipAddress: this.getIPAddress(),
            macAddress: this.getMacAddress(),
            bridgeID: this.getBridgeID(),
            utcTime: time.utcTime,
            localTime: time.localTime,
            timeZone: time.timeZone,
            modelID: this.getModelID()
        }

        return hueNodeService.getTemplateProcessor().setParameters(template, parameters);
    }

    /**
     * get 'nouser_config.json' template path
     */
    _getNoUserConfigTemplatePath() { 
        return path.join(APP_ROOT, "templates", NOUSER_CONFIG_FILE);
    }

    /**
     * get modelID
     */
    getModelID(){
        return this._getConfiguration().modelID;
    }

}

module.exports = HueConfiguration;