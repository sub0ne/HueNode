const dgram = require('dgram');
const fs = require ('fs');
const path = require ('path');
const SSDPParser = require('./SSDPParser.js');

const APP_ROOT = path.dirname(require.main.filename);
const MULTICAST_ADDRESS = "239.255.255.250";
const PORT = 1900;
const UPNP_RESPONSE_TEMPLATE_FILE = "UPnPResponse";

class UPnPServer {

    constructor() {
        this._socket = null;
    }

    stopListening() {
        if (this._socket) {
            global.getHueNodeService().getLogger().info(`[UPnPServer] Stopped listening`);
            this._socket.close();
        }
    }

    async startListening() {
       
        this._socket = dgram.createSocket('udp4');

        this._socket.on('message', (message, requestInfo) => {

            const strMessage = message.toString().trim();

            if (strMessage.includes('M-SEARCH * HTTP/1.1') &&
                strMessage.includes(`HOST: ${MULTICAST_ADDRESS}:${PORT}`) &&
                strMessage.includes('MAN: "ssdp:discover"') &&
                strMessage.includes('ST: ssdp:all')) {

                global.getHueNodeService().getLogger().info(`[UPnPServer] SSDP request received: ${strMessage}`);

                const ssdpParser = new SSDPParser(strMessage);
                const mxValue = ssdpParser.getMX() || 0;

                global.getHueNodeService().getLogger().info(`[UPnPServer] Received MX value: ${mxValue}`);

                const strResponse = this._getUPnPResponse();

                const response = new Buffer(strResponse); // TODO: use Buffer.from()

                const mxTimeout = Math.floor(Math.random() * mxValue * 1000); 

                setTimeout(() => {
                    this._socket.send(response,
                        0, // Buffer offset
                        response.length,
                        requestInfo.port,
                        requestInfo.address,
                        (error, byteLength) => {                        
                            global.getHueNodeService().getLogger().info(`[UPnPServer] Sent response to ${requestInfo.address}:${requestInfo.port}`);                        
                        }
                    );
                }, mxTimeout);

            }

        });

        this._socket.bind(PORT, () => {
            global.getHueNodeService().getLogger().info(`[UPnPServer] Listening to ${MULTICAST_ADDRESS}:${PORT}`);
            this._socket.addMembership(MULTICAST_ADDRESS);
          });        

    }

    _getUPnPResponseTemplatePath() {
        return path.join(APP_ROOT, "templates", UPNP_RESPONSE_TEMPLATE_FILE);
    }

    _getUPnPResponse() {
        
        const hueConfiguration = global.getHueNodeService().getHueConfiguration();

        let strResponse = fs.readFileSync(this._getUPnPResponseTemplatePath(), "utf8");
        return strResponse.replace('{uuid}', hueConfiguration.getUUID());
    }

}

module.exports = UPnPServer;