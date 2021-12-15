const logger = require('../logger');
const filemanager = require('./filemanager');
const constants = require('../../constants');
const {printError} = require('../utility');

module.exports.associateAction = async function(logLevel,opts,projectPath = constants.CURRENT_WORK_DIR){
    try{
        logger.setLevel(logLevel);
        if(!filemanager.checkBundleExistence(opts.archetypename,projectPath)){
            throw new Error(`The choosen archetype ${opts.archetypename} does not exist!`);
        }
        await filemanager.associateExistingActionToArchetype(opts);
    }catch(ex){
        logger.error(printError(ex));
    }
}