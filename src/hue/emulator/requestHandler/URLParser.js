
/**
 * URLParser for parsing parameters from a request
 */
const URLParser = {

    /**
     * check if url matches a given pattern
     */
    matchesPattern: (url, pattern) => {
        const strRegEx = pattern.replace(/(?<=\/):\w+/g, '\\w+'); // replace :variable with regex placeholder
        const regEx = new RegExp(`${strRegEx}[\/]?$`);
    
        return regEx.test(url);
    },

    /**
     * get parameters from url using a given pattern
     */
    getParameters: (url, pattern) => {
    
        const keyRegEx = /(?<=\/:)\w+/gm // get all :variables from pattern (keys)
        const keys = pattern.match(keyRegEx);
    
        const valueStrRegEx = pattern.replace(/(?<=\/):\w+/g, '(\\w+)'); // parse values from url
        const valueRegEx = new RegExp( valueStrRegEx, "gm");
        const values = valueRegEx.exec(url);
    
        // create parameters object
        const parameters = {};
    
        keys.forEach((key, index) => {
            parameters[key] = values[index + 1];
        });
    
        return parameters;
    
    }

}

module.exports = URLParser;