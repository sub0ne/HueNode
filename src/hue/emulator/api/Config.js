class Config {

    static getConfig() {
        return global.getHueNodeService().getHueConfiguration().getNoUserConfig();
    }

}

module.exports = Config;