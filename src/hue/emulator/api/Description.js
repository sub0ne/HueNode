class Description {

    static getDescription() {
        return global.getHueNodeService().getHueConfiguration().getHueBridgeDescription();
    }

}

module.exports = Description;