const express = require('express');
const getHandler = require('./requestHandler/GetHandler.js');
const putHandler = require('./requestHandler/PutHandler.js');
const postHandler = require('./requestHandler/PostHandler.js');

class Hue {

    constructor() {
        this._express = null;
        this._server = null;
    }

    stopHue() {
        if (this._server) {
            this._server.close();
            global.getHueNodeService().getLogger().info(`[Hue Emulator] Stopped`);
        }
    }

    startHue() {
        
        this._express = express();

        global.getHueNodeService().getLogger().info(`[Hue Emulator] Starting`);

        this._express.get('/*', (req, res) => getHandler.handleGet(req,res));
        this._express.post('/*', (req, res) => postHandler.handlePost(req,res));
        this._express.put('/*', (req, res) => putHandler.handlePut(req,res));

        global.getHueNodeService().getLogger().info(`[Hue Emulator] Listening on port 80`);
        this._server = this._express.listen(80);

    }

}

module.exports = Hue;