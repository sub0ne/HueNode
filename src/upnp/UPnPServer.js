const dgram = require('dgram');
const Logger = require('../Logger.js');
const SSDPParser = require('./SSDPParser.js');

const multicastAddress = "239.255.255.250";
const port = 1900;

class UPnPServer {

    constructor() {
        this._socket = null;
    }

    stopListening() {
        if (this._socket) {
            Logger.getLogger().info(`[UPnPServer] Stopped listening`);
            this._socket.close();
        }
    }

    async startListening() {

        this._socket = dgram.createSocket('udp4');

        this._socket.on('message', (message, requestInfo) => {

            const strMessage = message.toString().trim();

            if (strMessage.includes('M-SEARCH * HTTP/1.1') &&
                strMessage.includes(`HOST: ${multicastAddress}:${port}`) &&
                strMessage.includes('MAN: "ssdp:discover"') &&
                strMessage.includes('ST: ssdp:all')) {

                Logger.getLogger().info(`[UPnPServer] SSDP request received: ${strMessage}`);

                const ssdpParser = new SSDPParser(strMessage);
                const mxValue = ssdpParser.getMX() || 0;

                Logger.getLogger().info(`[UPnPServer] Received MX value: ${mxValue}`);

                const strResponse = 'HTTP/1.1 200 OK\r\n' +
                                    'CACHE-CONTROL: max-age=100\r\n' +
                                    'EXT:\r\n' +
                                    'LOCATION: http://192.168.178.34:80/description.xml\r\n' +
                                    'SERVER: FreeRTOS/6.0.5, UPnP/1.0, IpBridge/0.1\r\n' +
                                    'ST: upnp:rootdevice\r\n' +
                                    'USN: uuid:2fa00080-d000-11e1-9b23-001f80007bbe::upnp:rootdevice\r\n';

                const response = new Buffer(strResponse); // TODO: use Buffer.from()

                const mxTimeout = Math.floor(Math.random() * mxValue * 1000); 

                setTimeout(() => {
                    this._socket.send(response,
                        0, // Buffer offset
                        response.length,
                        requestInfo.port,
                        requestInfo.address,
                        (error, byteLength) => {                        
                            Logger.getLogger().info(`[UPnPServer] Sent response to ${requestInfo.address}:${requestInfo.port}`);                        
                        }
                    );
                }, mxTimeout);

            }

        });

        this._socket.bind(port, () => {
            Logger.getLogger().info(`[UPnPServer] Listening to ${multicastAddress}:${port}`);
            this._socket.addMembership('239.255.255.250');
          });        

    }

}

module.exports = UPnPServer;