const logger = require('../logger');
const constants = require('../../constants');
const csvmanager = require('./csvmanager');
const {extractArchetypeFiles} = require('../shell/shell_utils');
const {printError} = require('../utility');


module.exports = async function(logLevel,targetOrgAlias=constants.ORG_ALIAS,timestamp=false,projectPath = constants.CURRENT_WORK_DIR){
    try{
        const csvExport = await extractArchetypeFiles(targetOrgAlias);
        logger.setLevel(logLevel);
        csvmanager.recreateCSVForImport(projectPath,true,timestamp);
    }catch(ex){
        logger.error(printerror(ex));
    }
}