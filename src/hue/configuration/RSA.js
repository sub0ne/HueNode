const forge = require('node-forge');

const RSA = {

    generateCertificate(privateKey, publicKey, bridgeID) {

        const pki = forge.pki;

        const cert = forge.pki.createCertificate(); // create certificate
        cert.publicKey = publicKey; // set certificates public key

        cert.validity.notBefore = new Date();

        // certificate is valid for 30 days
        var validUntil = new Date();
        // validUntil.setDate(validUntil.getDate() + 30);
        validUntil.setFullYear(validUntil.getFullYear() + 50);
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
            value: bridgeID.toLowerCase()
        }
        ];
        cert.setSubject(attrs); // set subject attributes
        cert.setIssuer(attrs);  // set issues attributes

        // sign the certificate with the private key
        cert.sign(privateKey);

        return pki.certificateToPem(cert);

    },

    generateKeys() {

        global.getHueNodeService().Logger.info(`[RSA] Generating private and public key`);

        const pki = forge.pki;

        const keys = pki.rsa.generateKeyPair(2048);

        return {
            privateKey: pki.privateKeyToPem(keys.privateKey),
            publicKey: pki.publicKeyToPem(keys.publicKey)
        }

    }

}

module.exports = RSA;