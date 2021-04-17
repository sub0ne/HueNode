class Config {

    /**
     * return parsed JSON of 'nouser_config.json'
     */
    static getConfig() {
        return global.getHueNodeService().getHueConfiguration().getNoUserConfig();
    }

}

module.exports = Config;