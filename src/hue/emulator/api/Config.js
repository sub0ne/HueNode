class Config {

    /**
     * return parsed JSON of 'nouser_config.json'
     */
    static getJSONConfig() {
        return JSON.parse(global.getHueNodeService().getHueConfiguration().getSerializedNoUserConfig());
    }

}

module.exports = Config;