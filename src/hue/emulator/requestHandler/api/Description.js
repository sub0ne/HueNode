class Description {

    /**
     * return string of 'HueBridge.xml'
     */
    static getSerializedDescription() {
        return global.getHueNodeService().getHueConfiguration().getHueBridgeDescription();
    }

}

module.exports = Description;