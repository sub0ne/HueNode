const Hue = require('./hue/Hue.js');
const UPnPServer = require('./upnp/UPnPServer.js');

const hue = new Hue();
const upnpServer = new UPnPServer();

upnpServer.startListening();
hue.startHue();

