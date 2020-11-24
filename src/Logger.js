const winston = require('winston');
var path = require('path');

class Logger {

    static _logger;

    /**
     * get Logger instance
     */
    static getLogger(logLevel) {

        if (!Logger._logger) {
            Logger._initializeLogger(logLevel);
        }

        return Logger._logger;

    }

    /**
     * initialize the Logger instance
     */
    static _initializeLogger(logLevel) {
        if (!Logger._logger) {
            this._logger = winston.createLogger({
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

}

module.exports = Logger;