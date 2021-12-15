const filemanager = require('./filemanager');
const constants = require('../../constants');
const logger = require('../logger');
const utility = require('../utility');

module.exports = async (archetypename,logLevel,orgAlias = constants.ORG_ALIAS,projectPath=constants.CURRENT_WORK_DIR)=>{
    try{
        logger.setLevel(logLevel);
        await filemanager.updateArchetypeFile(archetypename,orgAlias,projectPath);
    }catch(ex){
        // throw new Error(ex.message);
        logger.error(utility.printError(ex));
    }
}