const Hue = require('./hue/emulator/Hue.js');
const UPnPServer = require('./upnp/UPnPServer.js');
const HueNodeService = require('./HueNodeService.js');


const hueNodeService = new HueNodeService();
global.getHueNodeService = () => {
    return hueNodeService;
}

const hue = new Hue();
const upnpServer = new UPnPServer();

process.on('SIGINT', function() {
    upnpServer.stopListening();
    hue.stopHue();
    process.exit();
});

upnpServer.startListening();
hue.startHue();




