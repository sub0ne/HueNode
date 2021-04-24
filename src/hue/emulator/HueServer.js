const express = require('express');
const forge = require('node-forge');
const bodyParser = require('body-parser');
const getHandler = require('./requestHandler/Get.js');
const putHandler = require('./requestHandler/Put.js');
const postHandler = require('./requestHandler/Post.js');
const deleteHandler = require('./requestHandler/Delete.js');
const http = require('http');
const https = require('https');

class HueServer {

    constructor() {
        this._httpServer = undefined;
    }

    /**
     * stop hue http/https server
     */
    stopServer() {
        if (this._httpServer) {
            this._httpServer.close();
            global.getHueNodeService().Logger.info(`[Hue Server] Stopped`);

            this._httpServer = undefined;
        }
    }

    /**
     * start hue http/https server
     */
    startServer() {

        const app = express();

        global.getHueNodeService().Logger.info(`[Hue Server] Starting`);

        // parse body to json
        app.use(bodyParser.json());

        // register handlers
        app.get('/*', (req, res) => getHandler.handleGet(req, res));
        app.post('/*', (req, res) => postHandler.handlePost(req, res));
        app.put('/*', (req, res) => putHandler.handlePut(req, res));
        app.delete('/*', (req, res) => deleteHandler(req, res));

        // used ports
        const port = 80;
        const sslPort = 443;

        global.getHueNodeService().Logger.info(`[Hue Server] Listening on port ${port}`);

        // setup http server
        this._httpServer = http.createServer(app);
        this._httpServer.listen(port);

        global.getHueNodeService().Logger.info(`[Hue Server] Listening on port ${sslPort}`);

        // setup https server
        this._httpsServer = https.createServer(this._getCredentials(), app);
        this._httpsServer.listen(sslPort);

    }

    isRunning() {
        return !!this._httpServer;
    }

    /**
     * get certificate for https communication
     */
    _getCredentials() {

        const pki = forge.pki;

        const privateKeyPem = pki.privateKeyToPem(global.getHueNodeService().getHueConfiguration().getPrivateKey());
        const certificatePem = pki.certificateToPem(global.getHueNodeService().getHueConfiguration().getCertificate());

        return {
            key: privateKeyPem,
            cert: certificatePem
        }
            ;
    }

}

module.exports = HueServer;