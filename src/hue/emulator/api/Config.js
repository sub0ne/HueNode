class Config {

    static getJSONConfig() {
        return JSON.parse(global.getHueNodeService().getHueConfiguration().getSerializedNoUserConfig());
    }

}

module.exports = Config;