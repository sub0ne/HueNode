class SSDPParser {
    
    constructor(ssdpMessage) {
        this._message = ssdpMessage;
    }

    /**
     * get the MX value
     */
    getMX() {
        return this._getValue("MX");
    }

    /**
     * Parse give value from SSDP request
     * @param {string} value 
     */
    _getValue(value){
        var regex = new RegExp(`(?<=${value}: )(.*?)(?=\r\n)`);
        const matched = regex.exec(this._message);

        return matched && matched[0];
    }

}

module.exports = SSDPParser;