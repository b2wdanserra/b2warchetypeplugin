const logger = require('../logger');
const constants = require('../../constants');
const csvmanager = require('./csvmanager');

module.exports = async function(logLevel,timestamp=false,projectPath = constants.CURRENT_WORK_DIR){
    try{
        logger.setLevel(logLevel);
        csvmanager.recreateCSVForImport(projectPath,true,timestamp);
    }catch(ex){
        logger.error(ex);
    }
}