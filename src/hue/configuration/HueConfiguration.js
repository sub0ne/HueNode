const fs = require('fs');
const path = require('path');
const Logger = require('../../Logger.js');
const { v4: uuidv4 } = require('uuid');

const HUE_BRIDGE_TEMPLATE_FILE = "HueBridgeTemplate.xml";
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

}

module.exports = HueConfiguration;