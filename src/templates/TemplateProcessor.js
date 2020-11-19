
const TemplateProcessor = {

    setParameters: (template, parameters) => {

        let result = template;

        Object.keys(parameters).forEach(parameter => {
            const strRegEx = `\\{${parameter}\\}`;
            const regEx = new RegExp(strRegEx, "g");

            result = result.replace(regEx, parameters[parameter]);
        });

        return result;

    }
    
}

module.exports = TemplateProcessor;