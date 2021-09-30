const filemanager = require('./filemanager');
const constants = require('../../constants');
const logger = require('../logger');

module.exports = (archetypename,logLevel,projectPath=constants.CURRENT_WORK_DIR)=>{
    try{
        logger.setLevel(logLevel);
        filemanager.updateArchetypeFile(archetypename,projectPath);
    }catch(ex){
        throw new Error(ex.message);
    }
}