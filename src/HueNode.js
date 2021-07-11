const HueNodeService = require('./HueNodeService.js');

// create and set the HueNodeService 
const hueNodeService = new HueNodeService();
global.getHueNodeService = () => {
    return hueNodeService;
}

// initialize configuration
hueNodeService.getHueConfiguration().initialize().then(() => {

    const hue = hueNodeService.getHue();
    const upnpServer = hueNodeService.getUPnPServer();

    // stop services on application exit
    process.on('SIGINT', function () {
        upnpServer.stopListening();
        hue.stopHue();
        process.exit();
    });

    // start Hue server and UPnP server, when done set log level to configured one
    Promise.all([
        upnpServer.startListening(),
        hue.startHue()
    ]).then(() => {
        hueNodeService.setLoggerToLogLevel();
    });

}).catch(() => {

});