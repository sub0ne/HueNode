const https = require('https');
const os = require('os');

const getIPs = () => {
    
    const net = os.networkInterfaces();

    const ipv4 = [];

    for (device in net) {
        ipv4.push(...net[device].filter(y => !y.internal && y.family === 'IPv4'));
    }
    
    return ipv4;
}

const test = (ip) => {

    return new Promise((resolve) => {

        var options = {
            host: 'www.google.com',
            method: 'GET',
            path: '/',
            port: 443,
            localAddress: ip.address
        };

        var req = https.request(options, function (res) {
            
            res.on('data', function (chunk) {
            });
        
            res.on('end', () => {     
                resolve({
                    address: ip.address,
                    mac: ip.mac,
                    statusCode: res.statusCode
                });                
            });
        
        });
        
        req.on('error', function (e) {
            resolve({
                address: ip.address,
                mac: ip.mac,
                error: true
            });
        });

        req.end();

    });

}


const testIPs = (ipv4) => {

    const tests = ipv4.map(ip => test(ip));

    return Promise.all(tests);

}


const determineIPAddress = {

    async get() {

        const ipv4 = getIPs();
        const testResult = await testIPs(ipv4);

        const ips = testResult.filter(ip => ip.statusCode === 200).map(ip => ip.address);

        return ips;
    }

}

module.exports = determineIPAddress;