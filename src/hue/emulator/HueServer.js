const express = require('express');
const bodyParser = require('body-parser');
const getHandler = require('./requestHandler/Get.js');
const putHandler = require('./requestHandler/Put.js');
const postHandler = require('./requestHandler/Post.js');
const deleteHandler = require('./requestHandler/Delete.js');

class HueServer {

    constructor() {
        this._express = undefined;
        this._server = undefined;
    }

    stopServer() {
        if (this._server) {
            this._server.close();
            global.getHueNodeService().Logger.info(`[Hue Server] Stopped`);
            
            this._server = undefined;
            this._express = undefined;
        }
    }

    startServer() {
        
        this._express = express();

        global.getHueNodeService().Logger.info(`[Hue Server] Starting`);

        this._express.use(bodyParser.json());

        this._express.get('/*', (req, res) => getHandler.handleGet(req,res));
        this._express.post('/*', (req, res) => postHandler.handlePost(req,res));
        this._express.put('/*', (req, res) => putHandler.handlePut(req,res));
        this._express.delete('/*', (req, res) => deleteHandler(req, res));

        const port = global.getHueNodeService().getHueConfiguration().getDefaultPort();

        global.getHueNodeService().Logger.info(`[Hue Server] Listening on port ${port}`);
        this._server = this._express.listen(port);

    }

    isRunning() {
        return this._server && this._server.listening();
    }

}

module.exports = HueServer;