const util = require('util');
const exec = util.promisify(require('child_process').exec);
const constants = require('../../constants');
const logger = require('../logger');

module.exports.extractArchetypeFiles = async (orgname) => {
    try{
        const sfdmuResult = await exec(`sfdx sfdmu:run --path "${constants.PROJECT_ROOT}\\util_data" --sourceusername ${orgname} --targetusername csvfile --noprompt`);
        logger.debug(sfdmuResult.stdout);
    }catch(ex){
        logger.error(JSON.stringify(ex));
    }
}

module.exports.importArchetypeFiles = async (targetOrgname) => {
    try{
        const sfdmuResult = await exec(`sfdx sfdmu:run --path "${constants.PROJECT_ROOT}\\util_data\\import" --sourceusername csvfile --targetusername ${targetOrgname} --noprompt`);
        logger.debug(sfdmuResult.stdout);
    }catch(ex){
        logger.error(JSON.stringify(ex));
    }
}


