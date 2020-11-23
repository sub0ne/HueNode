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

        global.getHueNodeService().Logger.info(`[Hue Server] Listening on port ${sslPort}`);

        this._httpsServer = https.createServer(this._getCredentials(), app);
        this._httpsServer.listen(sslPort);

    }

    isRunning() {
        return !!this._httpServer;
    }

    _getCredentials(){

        const pki = forge.pki;
        const keys = pki.rsa.generateKeyPair(2048); // create keys
        
        const cert = forge.pki.createCertificate(); // create certificate
        cert.publicKey = keys.publicKey; // set certificates public key

        const bridgeID = global.getHueNodeService().getHueConfiguration().getBridgeID().toLowerCase();

        cert.validity.notBefore = new Date();

        var validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);
        cert.validity.notAfter = validUntil;

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
        cert.setSubject(attrs); // set some attributes
        cert.setIssuer(attrs);
        
        cert.sign(keys.privateKey); // sign the certificate with the private key
        
        const privateKey = pki.privateKeyToPem(keys.privateKey); // pem private key
        const certificate = pki.certificateToPem(cert); // pem certificate
        
        const credentials = {
             key: privateKey, 
             cert: certificate}
        ;

        return credentials;

    }

}

module.exports = HueServer;