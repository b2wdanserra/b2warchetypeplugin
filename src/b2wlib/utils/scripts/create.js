const logger = require('../logger');
const filemanager = require('./filemanager');
const constants = require('../../constants');
const {printError} = require('../utility');

module.exports.createarchetype = async function(logLevel,opts,projectPath = constants.CURRENT_WORK_DIR){
    try{
        logger.setLevel(logLevel);
        if(filemanager.checkBundleExistence(opts.archetypename,projectPath)){
            throw new Error('The choosen archetype name is already in use!');
        }
        await filemanager.createArchetypeBoilerplate(projectPath,opts);
    }catch(ex){
        logger.error(printError(ex));
    }
}


module.exports.createarchetypecondition = async function (logLevel,opts,projectPath = constants.CURRENT_WORK_DIR){
    try{
        logger.setLevel(logLevel);
        if(!filemanager.checkBundleExistence(opts.archetypename,projectPath)){
            throw new Error(`The choosen archetype ${opts.archetypename} does not exist!`)
        }
        await filemanager.addConditionToBundle(opts);
    }catch(ex){
        logger.error(printError(ex));
    }
}


module.exports.createarchetypeaction = async function (logLevel,opts,projectPath = constants.CURRENT_WORK_DIR){
    try{
        logger.setLevel(logLevel);
        if(!filemanager.checkBundleExistence(opts.archetypename,projectPath)){
            throw new Error(`The choosen archetype ${opts.archetypename} does not exist!`);
        }
        await filemanager.addActionToBundle(opts);
    }catch(ex){
        logger.error(printError(ex));
    }
}

module.exports.createarchetypeactionstep = async function (logLevel,opts,projectPath = constants.CURRENT_WORK_DIR){

    try{
        logger.setLevel(logLevel);
        if(!filemanager.checkBundleExistence(opts.archetypename,projectPath)){
            throw new Error(`The choosen archetype ${opts.archetypename} does not exist!`);
        }
        await filemanager.addActionStepToBundle(opts);
    }catch(ex){
        logger.error(printError(ex));
    }
}