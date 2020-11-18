const express = require('express');
const bodyParser = require('body-parser');
const getHandler = require('./requestHandler/Get.js');
const putHandler = require('./requestHandler/Put.js');
const postHandler = require('./requestHandler/Post.js');

class Hue {

    constructor() {
        this._express = null;
        this._server = null;
    }

    stopHue() {
        if (this._server) {
            this._server.close();
            global.getHueNodeService().Logger.info(`[Hue Emulator] Stopped`);
        }
    }

    startHue() {
        
        this._express = express();

        global.getHueNodeService().Logger.info(`[Hue Emulator] Starting`);

        this._express.use(bodyParser.json());

        this._express.get('/*', (req, res) => getHandler.handleGet(req,res));
        this._express.post('/*', (req, res) => postHandler.handlePost(req,res));
        this._express.put('/*', (req, res) => putHandler.handlePut(req,res));

        const port = global.getHueNodeService().getHueConfiguration().getDefaultPort();

        global.getHueNodeService().Logger.info(`[Hue Emulator] Listening on port ${port}`);
        this._server = this._express.listen(port);

    }

}

module.exports = Hue;