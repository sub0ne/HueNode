
const URLParser = {

    matchesPattern: (url, pattern) => {
        const strRegEx = pattern.replace(/(?<=\/):\w+/g, '\\w+');
        const regEx = new RegExp(`${strRegEx}[\/]?$`);
    
        return regEx.test(url);
    },

    getParameters: (url, pattern) => {
    
        const keyRegEx = /(?<=\/:)\w+/gm
        const keys = pattern.match(keyRegEx);
    
        const valueStrRegEx = pattern.replace(/(?<=\/):\w+/g, '(\\w+)'); 
        const valueRegEx = new RegExp( valueStrRegEx, "gm");
        const values = valueRegEx.exec(url);
    
        const parameters = {};
    
        keys.forEach((key, index) => {
            parameters[key] = values[index + 1];
        });
    
        return parameters;
    
    },


    getParameters2: (url, pattern) => {
        
        const keyRegEx = /(?<=\/:)\w+/gm
        const keys = url.match(keyRegEx);
    
        const valueStrRegEx = pattern.replace(/(?<=\/):\w+/g, '(\\w+)'); 
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