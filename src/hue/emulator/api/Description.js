class Description {

    /**
     * return string of 'HueBridge.xml'
     */
    static getSerializedDescription() {
        return global.getHueNodeService().getHueConfiguration().getSerializedHueBridgeDescription();
    }

}

module.exports = Description;