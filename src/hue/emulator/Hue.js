const express = require('express');
const Logger = require('../../Logger.js');
const getHandler = require('./GetHandler.js');
const putHandler = require('./PutHandler.js');
const postHandler = require('./PostHandler.js');

class Hue {

    constructor() {
        this._express = null;
        this._server = null;
    }

    stopHue() {
        if (this._server) {
            this._server.close();
            Logger.getLogger().info(`[Hue Emulator] Stopped`);
        }
    }

    startHue() {
        
        this._express = express();

        Logger.getLogger().info(`[Hue Emulator] Starting`);

        this._express.get('/*', (req, res) => getHandler.handleGet(req,res));
        this._express.post('/*', (req, res) => postHandler.handlePost(req,res));
        this._express.put('/*', (req, res) => putHandler.handlePut(req,res));

        Logger.getLogger().info(`[Hue Emulator] Listening on port 80`);
        this._server = this._express.listen(80);

    }

}

module.exports = Hue;