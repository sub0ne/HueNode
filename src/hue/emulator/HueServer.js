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
        app.get('/*', (req, res) => getHandler.handleGet(req,res));
        app.post('/*', (req, res) => postHandler.handlePost(req,res));
        app.put('/*', (req, res) => putHandler.handlePut(req,res));
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
     * create self signed certificate for https communication
     */
    _getCredentials(){

        const pki = forge.pki;
        const keys = pki.rsa.generateKeyPair(2048); // create keys
        
        const cert = forge.pki.createCertificate(); // create certificate
        cert.publicKey = keys.publicKey; // set certificates public key

        const bridgeID = global.getHueNodeService().getHueConfiguration().getBridgeID().toLowerCase();

        cert.validity.notBefore = new Date();

        // certificate is valid for 30 days
        var validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);
        cert.validity.notAfter = validUntil;

        // attributes according to Hue API
        const attrs = [{
            name: 'countryName',
            value: 'NL'
          }, {
            name: 'organizationName',
            value: 'Philips Hue'
          }, {
            name: 'commonName',
            value: bridgeID
          }
        ];
        cert.setSubject(attrs); // set subject attributes
        cert.setIssuer(attrs);  // set issues attributes
        
        // sign the certificate with the private key
        cert.sign(keys.privateKey); 

        // pem 
        const privateKey = pki.privateKeyToPem(keys.privateKey); 
        const certificate = pki.certificateToPem(cert); 
        
        const credentials = {
             key: privateKey, 
             cert: certificate}
        ;

        return credentials;

    }

}

module.exports = HueServer;