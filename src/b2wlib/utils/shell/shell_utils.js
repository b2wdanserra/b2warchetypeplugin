const util = require('util');
const exec = util.promisify(require('child_process').exec);
const constants = require('../../constants');
const {join} = require('path');
const logger = require('../logger');

const UTIL_DATA_FOLDER = join(constants.PROJECT_ROOT,'util_data');
const UTIL_IMPORT_FOLDER = join(constants.PROJECT_ROOT,'util_data','import');

module.exports.extractArchetypeFiles = async (orgname) => {
    try{
        const sfdmuResult = await exec(`sfdx sfdmu:run --path "${UTIL_DATA_FOLDER}" --sourceusername ${orgname} --targetusername csvfile --noprompt`);
        logger.debug(sfdmuResult.stdout);
    }catch(ex){
        logger.error(JSON.stringify(ex));
    }
}

module.exports.importArchetypeFiles = async (targetOrgname) => {
    try{
        const sfdmuResult = await exec(`sfdx sfdmu:run --path "${UTIL_IMPORT_FOLDER}" --sourceusername csvfile --targetusername ${targetOrgname} --noprompt`);
        logger.debug(sfdmuResult.stdout);
    }catch(ex){
        logger.error(JSON.stringify(ex));
    }
}


