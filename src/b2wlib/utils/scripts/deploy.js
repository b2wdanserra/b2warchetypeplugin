const constants = require('../../constants');
const csvmanager = require('./csvmanager');
const {importArchetypeFiles,extractArchetypeFiles} = require('../shell/shell_utils');
const shared_utils = require('./shared_utils');
const logger = require('../logger');


module.exports = async function(targetOrgAlias=constants.ORG_ALIAS,logLevel,projectPath = constants.CURRENT_WORK_DIR){
    logger.setLevel(logLevel);
    shared_utils.emptySFDMULogs();
    const csvExport = await extractArchetypeFiles(targetOrgAlias);
    const csvRebuild = await csvmanager.recreateCSVForImport(projectPath);
    const upsertResult = await importArchetypeFiles(targetOrgAlias);
}