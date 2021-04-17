const path = require('path');

const APP_ROOT = path.dirname(require.main.filename);
const DATA_FOLDER = "data";

class BaseHandler {

    /**
      * get '<APP_ROOT>/data/' path
      */
    _getDataFolderPath() {
        return path.join(APP_ROOT, DATA_FOLDER);
    }


}

module.exports = BaseHandler;