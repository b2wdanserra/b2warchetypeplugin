const csvmanager = require('./csvmanager');
const filemanager = require('./filemanager');
const shell_utils = require('../shell/shell_utils');
const constants = require('../../constants');
const sfdxutils = require('./sfdxutils');
const logger = require('../logger');
const shared_utils = require('./shared_utils');
const {printError} = require('../utility');


module.exports.extractAll = async function(orgAlias = constants.ORG_ALIAS,logLevel,projectPath = constants.CURRENT_WORK_DIR){
    try{
        logger.setLevel(logLevel);
        await sfdxutils.checkAlias(orgAlias);
        shared_utils.emptySFDMULogs();
        const csvExport = await shell_utils.extractArchetypeFiles(orgAlias);
        const archStructure = await csvmanager.getArchetypeStructure();
        const baseFolderPath = await filemanager.createArchetypeBundleDirectories(archStructure,projectPath);
        filemanager.populateArchetypeBundleFolder(baseFolderPath,archStructure);
    }catch(ex){
        logger.error(printError(ex));
        throw new Error(ex.message);
    }
}

