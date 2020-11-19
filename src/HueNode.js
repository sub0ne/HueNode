const HueNodeService = require('./HueNodeService.js');

const hueNodeService = new HueNodeService();
global.getHueNodeService = () => {
    return hueNodeService;
}

const hue = hueNodeService.getHue();
const upnpServer = hueNodeService.getUPnPServer();

process.on('SIGINT', function() {
    upnpServer.stopListening();
    hue.stopHue();
    process.exit();
});

upnpServer.startListening();
hue.startHue();

