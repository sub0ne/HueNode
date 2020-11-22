const express = require('express');
const bodyParser = require('body-parser');
const getHandler = require('./requestHandler/Get.js');
const putHandler = require('./requestHandler/Put.js');
const postHandler = require('./requestHandler/Post.js');
const deleteHandler = require('./requestHandler/Delete.js');
const http = require('http');

class HueServer {

    constructor() {
        this._httpServer = undefined;
    }

    stopServer() {
        if (this._httpServer) {
            this._httpServer.close();
            global.getHueNodeService().Logger.info(`[Hue Server] Stopped`);
            
            this._httpServer = undefined;
        }
    }

    startServer() {
        
        const app = express();

        global.getHueNodeService().Logger.info(`[Hue Server] Starting`);

        app.use(bodyParser.json());

        app.get('/*', (req, res) => getHandler.handleGet(req,res));
        app.post('/*', (req, res) => postHandler.handlePost(req,res));
        app.put('/*', (req, res) => putHandler.handlePut(req,res));
        app.delete('/*', (req, res) => deleteHandler(req, res));

        const port = 80;
        const sslPort = 443;

        global.getHueNodeService().Logger.info(`[Hue Server] Listening on port ${port}`);

        this._httpServer = http.createServer(app);
        this._httpServer.listen(port);

    }

    isRunning() {
        return !!this._httpServer;
    }

}

module.exports = HueServer;