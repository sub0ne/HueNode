
const URLParser = {

    matchesPattern: (url, pattern) => {
        const strRegEx = pattern.replace(/(?<=\/):\w+/g, '\\w+'); // replace :variable with regex placeholder
        const regEx = new RegExp(`${strRegEx}[\/]?$`);
    
        return regEx.test(url);
    },

    getParameters: (url, pattern) => {
    
        const keyRegEx = /(?<=\/:)\w+/gm // get all :variables from pattern (keys)
        const keys = pattern.match(keyRegEx);
    
        const valueStrRegEx = pattern.replace(/(?<=\/):\w+/g, '(\\w+)'); // parse values from url
        const valueRegEx = new RegExp( valueStrRegEx, "gm");
        const values = valueRegEx.exec(url);
    
        const parameters = {};
    
        keys.forEach((key, index) => {
            parameters[key] = values[index + 1];
        });
    
        return parameters;
    
    }

}

module.exports = URLParser;