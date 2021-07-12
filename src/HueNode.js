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

    const stopServices = () => {
        hue.stopHue();
        process.exit();
    };

    // stop services on application exit SIGINT
    process.on('SIGINT', function () {
        stopServices();
    });

    // stop services on application exit SIGTERM
    process.on('SIGTERM', function () {
        stopServices();
    });

    // start Hue server and UPnP server, when done set log level to configured one
    Promise.all([
        upnpServer.startListening(),
        hue.startHue()
    ]).then(() => {
        hueNodeService.setLoggerToConfigLogLevel();
    }).catch((err) => {
        hueNodeService.Logger.error(`[HueNode] ${err.message}`);      
        stopServices();
    });

}).catch(() => {

});