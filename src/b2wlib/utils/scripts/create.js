const logger = require('../logger');
const filemanager = require('./filemanager');
const constants = require('../../constants');
const {printError} = require('../utility');

module.exports.createarchetype = async function(logLevel,opts,projectPath = constants.CURRENT_WORK_DIR){
    try{
        logger.setLevel(logLevel);
        filemanager.createArchetypeBoilerplate(projectPath,opts);
    }catch(ex){
        logger.error(printError(ex));
    }
}