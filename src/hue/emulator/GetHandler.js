const Logger = require('../../Logger.js');

let state = false;

const handleGet = (request, response) => {

    Logger.getLogger().info(`[Hue Emulator] HTTP-Request (GET) received: ${request.url}`);    

    if (request.url === '/description.xml') {

        const responseData = '<?xml version="1.0" encoding="UTF-8"?>' + 
        '<root>' +
            '<specVersion>' +
                '<major>1</major>' +
                '<minor>0</minor>' +
            '</specVersion>' +
            '<URLBase>http://192.168.178.34:80/</URLBase>' +
            '<device>' +
                '<deviceType>urn:schemas-upnp-org:device:Basic:1</deviceType>' +
                '<friendlyName>Philips hue (192.168.178.34)</friendlyName>' +
                '<manufacturer>Signify</manufacturer>' +
                '<manufacturerURL>http://www.philips-hue.com</manufacturerURL>' +
                '<modelDescription>Philips hue Personal Wireless Lighting</modelDescription>' +
                '<modelName>Philips hue bridge 2015</modelName>' +
                '<modelNumber>BSB002</modelNumber>' +
                '<modelURL>http://www.philips-hue.com</modelURL>' +
                '<serialNumber>001f80007bbe</serialNumber>' +
                '<UDN>uuid:2fa00080-d000-11e1-9b23-001f80007bbe</UDN>' +
                '<presentationURL>index.html</presentationURL>' +
                '<iconList>' +
                    '<icon>' +
                        '<mimetype>image/png</mimetype>' +
                        '<height>48</height>' +
                        '<width>48</width>' +
                        '<depth>24</depth>' +
                        '<url>hue_logo_0.png</url>' +
                    '</icon>' +
                '</iconList>' +
            '</device>' +
        '</root>';

        response.status(200);
        response.type('application/xml');
        response.send(responseData);

    } else if (request.url.endsWith('/lights')) {

        const responseData = {
            2: {
                "state": {
                    "on": state,
                    "alert": "select",
                    "reachable": true
                },
                "swupdate": {
                    "state": "notupdatable",
                    "lastinstall": "2020-11-05T18:37:08"
                },
                "type": "Dimmable light",
                "name": "On/Off plug 2",
                "modelid": "SP 120",
                "manufacturername": "innr",
                "productname": "On/Off plug",
                "capabilities": {
                    "certified": false,
                    "control": {
                    },
                    "streaming": {
                        "renderer": false,
                        "proxy": false
                    }
                },
                "config": {
                    "archetype": "classicbulb",
                    "function": "functional",
                    "direction": "omnidirectional"
                },
                "uniqueid": "00:15:8d:00:03:88:60:68-22",
                "swversion": "2.0"
            }
        };

        response.status(200);
        response.type('application/json');
        response.send(responseData);

    } else if (request.url.endsWith('/lights/2')) {

        const responseData = {
            "state": {
                "on": state,
                "alert": "select",
                "reachable": true
            },
            "swupdate": {
                "state": "notupdatable",
                "lastinstall": "2020-11-05T18:37:08"
            },
            "type": "Dimmable light",
            "name": "On/Off plug 2",
            "modelid": "SP 120",
            "manufacturername": "innr",
            "productname": "On/Off plug",
            "capabilities": {
                "certified": false,
                "control": {},
                "streaming": {
                    "renderer": false,
                    "proxy": false
                }
            },
            "config": {
                "archetype": "classicbulb",
                "function": "functional",
                "direction": "omnidirectional"
            },
            "uniqueid": "00:15:8d:00:03:88:60:68-22",
            "swversion": "2.0"
        };

        response.status(200);
        response.type('application/json');
        response.send(responseData);
    }

}

exports.handleGet = handleGet;