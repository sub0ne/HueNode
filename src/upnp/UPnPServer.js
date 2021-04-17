const dgram = require('dgram');
const SSDPParser = require('./SSDPParser.js');

const MULTICAST_ADDRESS = "239.255.255.250";
const PORT = 1900;

class UPnPServer {

    constructor() {
        this._socket = null;
    }

    /**
     * stop listening
     */
    stopListening() {
        if (this._socket) {
            global.getHueNodeService().Logger.info(`[UPnPServer] Stopped listening`);
            this._socket.close();
        }
    }

    /**
     * start listening
     */
    async startListening() {
       
        this._socket = dgram.createSocket('udp4');

        this._socket.on('message', (message, requestInfo) => {

            const strMessage = message.toString().trim();

            // check if required SSDP request is received            
            if (strMessage.includes('M-SEARCH * HTTP/1.1') &&
                strMessage.includes(`HOST: ${MULTICAST_ADDRESS}:${PORT}`) &&
                strMessage.includes('MAN: "ssdp:discover"') &&
                strMessage.includes('ST: ssdp:all')) {

                global.getHueNodeService().Logger.info(`[UPnPServer] SSDP request received: ${strMessage}`);

                // get MX value from request
                const ssdpParser = new SSDPParser(strMessage);
                const mxValue = ssdpParser.getMX() || 0;

                global.getHueNodeService().Logger.info(`[UPnPServer] Received MX value: ${mxValue}`);

                const strResponse = this._getUPnPResponse();

                const response = new Buffer(strResponse); // TODO: use Buffer.from()

                // wait up to mxValue before sending the response
                const mxTimeout = Math.floor(Math.random() * mxValue * 1000); 

                setTimeout(() => {
                    this._socket.send(response,
                        0, // Buffer offset
                        response.length,
                        requestInfo.port,
                        requestInfo.address,
                        (error, byteLength) => {                        
                            global.getHueNodeService().Logger.info(`[UPnPServer] Sent response to ${requestInfo.address}:${requestInfo.port}`);                        
                        }
                    );
                }, mxTimeout);

            }

        });

        // bind socket
        this._socket.bind(PORT, () => {
            
            global.getHueNodeService().Logger.info(`[UPnPServer] Listening to ${MULTICAST_ADDRESS}:${PORT}`);
            
            // subscribe on 239.255.255.250
            this._socket.addMembership(MULTICAST_ADDRESS); 
          });        

    }

    /**
     * get the UPnPResponse
     */
    _getUPnPResponse() {
        
        const hueNodeService = global.getHueNodeService();

        const hueConfiguration = hueNodeService.getHueConfiguration();
        
        // response parameters
        const parameters = {
            uuid: hueConfiguration.getUUID(),            
            ipAddress: hueConfiguration.getIPAddress()            
        }

        // get UPnPResponseparameters and return response
        return hueNodeService.getTemplateProcessor().getUPnPResponse(parameters);

    }

}

module.exports = UPnPServer;