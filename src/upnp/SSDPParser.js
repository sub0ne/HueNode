class SSDPParser {
    
    constructor(ssdpMessage) {
        this._message = ssdpMessage;
    }

    getMX() {
        return this._getValue("MX");
    }

    _getValue(value){
        var regex = new RegExp(`(?<=${value}: )(.*?)(?=\r\n)`);
        const matched = regex.exec(this._message);

        return matched && matched[0];
    }

}

module.exports = SSDPParser;