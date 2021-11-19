const filemanager = require('./filemanager');
const constants = require('../../constants');
const logger = require('../logger');
const utility = require('../utility');

module.exports = (archetypename,logLevel,projectPath=constants.CURRENT_WORK_DIR)=>{
    try{
        logger.setLevel(logLevel);
        filemanager.updateArchetypeFile(archetypename,projectPath);
    }catch(ex){
        // throw new Error(ex.message);
        logger.error(utility.printError(ex));
    }
}