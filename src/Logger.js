const winston = require('winston');
var path = require('path');

class Logger {

    /**
     * get Logger instance
     */
    static getLogger(logLevel) {
        return Logger._initializeLogger(logLevel);
    }

    /**
     * initialize the Logger instance
     */
    static _initializeLogger(logLevel) {
        return winston.createLogger({
                level: logLevel || 'info',
                format: winston.format.combine(
                    winston.format.label({ label: '[HueNode]' }),
                    winston.format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss'
                    }),
                    winston.format.json(),
                    winston.format.printf(info => `${info.label} ${info.timestamp}: ${info.level} - ${info.message}`)
                ),
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: path.join(__dirname, 'HueNode.log') })
                ]
            });
    }

}

module.exports = Logger;