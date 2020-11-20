class Description {

    static getSerializedDescription() {
        return global.getHueNodeService().getHueConfiguration().getSerializedHueBridgeDescription();
    }

}

module.exports = Description;