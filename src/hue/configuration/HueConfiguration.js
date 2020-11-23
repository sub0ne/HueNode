const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const HUE_BRIDGE_TEMPLATE_FILE = "HueBridge.xml";
const NOUSER_CONFIG_FILE = "nouser_config.json";
const APP_ROOT = path.dirname(require.main.filename);
const DATA_FOLDER = "data";
const HUE_CONFIGURATION_FILE = "Configuration.json";

class HueConfiguration {

    constructor() {         
    }

    getSerializedHueBridgeDescription() {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Hue Configuration] Loading hue bridge template: ${this._getHueBridgeTemplatePath()}`);
        let template = fs.readFileSync(this._getHueBridgeTemplatePath(), "utf8");

        const parameters = {
            uuid: this.getUUID(),
            serialNumber: this.getSerialNumber(),
            ipAddress: this.getIPAddress(),
            modelID: this.getModelID()
        }

        return hueNodeService.getTemplateProcessor().setParameters(template, parameters);
    }

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

    _loadConfiguration() {
        global.getHueNodeService().Logger.info(`[Hue Configuration] Loading configuration file: ${this._getConfigurationFilePath()}`);    

        this._configuration = JSON.parse(fs.readFileSync(this._getConfigurationFilePath()));

    }

    _saveConfiguration() {
        global.getHueNodeService().Logger.info(`[Hue Configuration] Save configuration file: ${this._getConfigurationFilePath()}`);

        const data = new Uint8Array(Buffer.from(JSON.stringify(this._configuration, null, 1)));
        
        fs.writeFile(this._getConfigurationFilePath(), data, () => {});

    }

    _setupNewConfiguration() {

        global.getHueNodeService().Logger.info(`[Hue Configuration] Create new hue configuration`);    

        const uuid = uuidv4();;
        const serialNumber = uuid.split('-')[4];
        
        this._configuration = {
            name: 'HueNode Hue',
            uuid,
            serialNumber
        }        
    }

    _getDataFolderPath() {
        return path.join(APP_ROOT, DATA_FOLDER);
    }

    _getConfigurationFilePath() {
         return path.join(this._getDataFolderPath(), HUE_CONFIGURATION_FILE);
    }

    _getHueBridgeTemplatePath() {
        return path.join(APP_ROOT, "templates", HUE_BRIDGE_TEMPLATE_FILE);
    }

    getUUID(){
        return this._getConfiguration().uuid;
    }

    getSerialNumber() {
        return this._getConfiguration().serialNumber;
    }

    getBridgeID() {
        const serialNumber = this.getSerialNumber();
        const bridgeID = serialNumber.substring(0, 6) + "FFFE" + serialNumber.substring(6);
        return bridgeID.toUpperCase();
    }

    getName() {
        return this._getConfiguration().name;
    }

    getMacAddress() {

        const serialNumber = this.getSerialNumber().toUpperCase();

        const keySegments = [];

        for (let i = 0; i <= 5; i++) {
            keySegments.push(serialNumber.substring(i*2, i*2 + 2));
        }
              
        return keySegments.join(":");

    }

    getIPAddress() {
        return "192.168.178.31";
    }

    getTime() {
        return {
            localTime: moment().format('YYYY-MM-DTHH:mm:ss'),
            utcTime: moment().utc().format('YYYY-MM-DTHH:mm:ss'),
            timeZone: 'Europe/Berlin'
        }
    }

    getSerializedNoUserConfig() {

        const hueNodeService = global.getHueNodeService();

        hueNodeService.Logger.info(`[Hue Configuration] Loading nouser config template: ${this._getNoUserConfigTemplatePath()}`);            
        let template = fs.readFileSync(this._getNoUserConfigTemplatePath(), "utf8");
 
        const time = this.getTime();

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

    _getNoUserConfigTemplatePath() { 
        return path.join(APP_ROOT, "templates", NOUSER_CONFIG_FILE);
    }

    getModelID(){
        return "BSB002";
    }

}

module.exports = HueConfiguration;