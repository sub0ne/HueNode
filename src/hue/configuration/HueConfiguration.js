const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Logger = require('../../Logger.js');
const { v4: uuidv4 } = require('uuid');

const HUE_BRIDGE_TEMPLATE_FILE = "HueBridgeTemplate.xml";
const NOUSER_CONFIG_FILE = "nouser_config_template.json";
const APP_ROOT = path.dirname(require.main.filename);
const DATA_FOLDER = "data";
const HUE_CONFIGURATION_FILE = "Configuration.json";

class HueConfiguration {

    constructor() { 
    }

    getHueBridgeDescription() {
        Logger.getLogger().info(`[Hue Configuration] Loading hue bridge template: ${this._getHueBridgeTemplatePath()}`);    
        let template = fs.readFileSync(this._getHueBridgeTemplatePath(), "utf8");

        template = template.replace('{uuid}', this.getUUID());
        template = template.replace('{serialNumber}', this.getSerialNumber());
        template = template.replace('{ipAddress}', this.getIPAddress()); // TODO: replace all
        template = template.replace('{ipAddress}', this.getIPAddress());
        template = template.replace('{modelID}', this.getModelID);

        return template;
    }

    _getConfiguration() {

        if (!this._configuration) {

            if (!fs.existsSync(this._getDataFolderPath())) {
                Logger.getLogger().info(`[Hue Configuration] Create folder 'data'`);
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
        Logger.getLogger().info(`[Hue Configuration] Loading configuration file: ${this._getConfigurationFilePath()}`);    

        this._configuration = JSON.parse(fs.readFileSync(this._getConfigurationFilePath()));

    }

    _saveConfiguration() {
        Logger.getLogger().info(`[Hue Configuration] Save configuration file: ${this._getConfigurationFilePath()}`);

        const data = new Uint8Array(Buffer.from(JSON.stringify(this._configuration, null, 1)));
        
        fs.writeFile(this._getConfigurationFilePath(), data, () => {});

    }

    _setupNewConfiguration() {

        Logger.getLogger().info(`[Hue Configuration] Create new hue configuration`);    

        const uuid = uuidv4();;
        const serialNumber = uuid.split('-')[4];
        
        this._configuration = {
            Name: 'HueNode Hue',
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
        return path.join(__dirname, HUE_BRIDGE_TEMPLATE_FILE);
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

    getMacAddress() {
        const serialNumber = this.getSerialNumber();
        const macAddress = `${serialNumber.substring(0,2)}:${serialNumber.substring(2,4)}:${serialNumber.substring(4,6)}:${serialNumber.substring(6,8)}:${serialNumber.substring(8,10)}:${serialNumber.substring(10,12)}`;
        return macAddress.toUpperCase();
    }

    getIPAddress() {
        return "192.168.178.34";
    }

    getTime() {
        return {
            localTime: moment().format('YYYY-MM-DTHH:mm:ss'),
            utcTime: moment().utc().format('YYYY-MM-DTHH:mm:ss'),
            timeZone: 'Europe/Berlin'
        }
    }

    getNoUserConfig() {
        Logger.getLogger().info(`[Hue Configuration] Loading nouser config template: ${this._getNoUserConfigTemplatePath()}`);    
        let template = fs.readFileSync(this._getNoUserConfigTemplatePath(), "utf8");
 
        const time = this.getTime();

        template = template.replace('{ipAddress}', this.getIPAddress());
        template = template.replace('{ipAddress}', this.getIPAddress());
        template = template.replace('{macAddress}', this.getMacAddress());        
        template = template.replace('{bridgeID}', this.getBridgeID());
        template = template.replace('{utcTime}', time.utcTime);
        template = template.replace('{localTime}', time.localTime);
        template = template.replace('{timeZone}', this.timeZone);
        template = template.replace('{modelID}', this.getModelID);

        return template;
    }

    _getNoUserConfigTemplatePath() { 
        return path.join(__dirname, NOUSER_CONFIG_FILE);
    }

    getModelID(){
        return "BSB002";
    }

}

module.exports = HueConfiguration;