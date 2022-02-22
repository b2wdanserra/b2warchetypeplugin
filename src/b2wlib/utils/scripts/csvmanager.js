const csv = require('csvtojson');
const {parseAsync} = require('json2csv');
const fs = require('fs-extra');
const _ = require('lodash');
const {join} = require('path');
const logger = require('../logger');
const constants = require('../../constants');
const {readFilesAsObject,readArchetypeFileOnSubDirs,createArtifactDirectoryStructure,cleanEnvIds} = require('./shared_utils');
const EXTRACTED_FILE_PATH = join(constants.UTIL_DATA_BASE_FOLDER,'util_data','target');
const IMPORT_PROJECT_PATH = join(constants.UTIL_DATA_BASE_FOLDER,'util_data','import');
const BASE_PROJECT_PATH = constants.UTIL_DATA_BASE_FOLDER;
const utility = require('../utility');
const shell_utils = require('../shell/shell_utils');


module.exports.getArchetypeStructure = async (b2wprojectpath = BASE_PROJECT_PATH)=>{
    const csvJsonContents = await readMultipleCSV(EXTRACTED_FILE_PATH);
    const reparentedRecords = reparentRecords(csvJsonContents);
    return reparentedRecords;
}

module.exports.recreateCSVForImport = async (b2wprojectpath = BASE_PROJECT_PATH,generateArtifact=false,timestamp=false) =>{
    try{
        const filesMap = recreateCSVFromJSON(b2wprojectpath);
        const outcsv = await writeExportCSVToFile(filesMap,generateArtifact,timestamp);
    }catch(ex){
        logger.error(utility.printError(ex));
    }
}


module.exports.reAlignArchetypeMetadataJSONWithOrg = async (archetypeName,orgAlias) => {
    const extractionResult = await shell_utils.extractArchetypeFiles(orgAlias);
    const jsonArchetypes = await this.getArchetypeStructure();
    const mappedArchetypeString = _.groupBy(jsonArchetypes,'name');

    if(mappedArchetypeString.hasOwnProperty(archetypeName)){
        return mappedArchetypeString[archetypeName][0];
    }

    return null;
}


function reparentRecords(csvJsonContents){

    const result = [];
    const cleanUpParams = constants['CLEAN_UP_IDS'];

    //v1.2.0 --> archetype mapping will be cleaned of environment dependent ids and will be based on externalIds only
    

    //getting objects

    //v1.2.0. filter json content excluding ids
    const archetypes = cleanEnvIds(csvJsonContents[`${constants.ARCHTYPE_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.ARCHTYPE_OBJECT_KEY]);
    const columnConditions = cleanEnvIds(csvJsonContents[`${constants.COLUMN_COND_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.COLUMN_COND_OBJECT_KEY]);
    const columnActions = cleanEnvIds(csvJsonContents[`${constants.COLUMN_ACT_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.COLUMN_ACT_OBJECT_KEY]);
    const actions = cleanEnvIds(csvJsonContents[`${constants.ACTION_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.ACTION_OBJECT_KEY]);
    const conditions = cleanEnvIds(csvJsonContents[`${constants.CONDITION_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.CONDITION_OBJECT_KEY]);
    const actionSteps = cleanEnvIds(csvJsonContents[`${constants.ACTION_STEP_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.ACTION_STEP_OBJECT_KEY]);
    const conditionParams = cleanEnvIds(csvJsonContents[`${constants.CONDITION_PARAM_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.CONDITION_PARAM_OBJECT_KEY]);
    const actionParams = cleanEnvIds(csvJsonContents[`${constants.ACTION_PARAM_OBJECT_KEY}${constants.TARGET_FILE_EXTENSION_FINAL}`],cleanUpParams[constants.ACTION_PARAM_OBJECT_KEY]);


    //grouping objects
    const gArchetypes = _.groupBy(archetypes,'Bit2Archetypes__External_Id__c');
    const gColumnConditions = _.groupBy(columnConditions,'Bit2Archetypes__Archetype__r.Bit2Archetypes__External_Id__c');
    const gColumnActions = _.groupBy(columnActions,'Bit2Archetypes__Archetype__r.Bit2Archetypes__External_Id__c');


    logger.debug(`Grouped column actions ${JSON.stringify(gColumnActions)}`);
    logger.debug(`Grouped column conditions ${JSON.stringify(gColumnActions)}`);

    //v1.2.0 change the mapping for reparenting, using externalIds only
    for(const arch of archetypes){
        const singleArchetypeJson = {};

        //archetype and column actions/conditions
        singleArchetypeJson['name'] = arch.Bit2Archetypes__Name__c;

        logger.debug(`Processing reparenting for archetype: ${arch.Bit2Archetypes__Name__c}`);

        singleArchetypeJson[constants.ARCHTYPE_OBJECT_KEY] = arch;
        singleArchetypeJson[constants.COLUMN_COND_OBJECT_KEY] = gColumnConditions[arch.Bit2Archetypes__External_Id__c];
        singleArchetypeJson[constants.COLUMN_ACT_OBJECT_KEY] = gColumnActions[arch.Bit2Archetypes__External_Id__c];

        try{
            //associationg action conditions(trickier)
            let actionsIds = [];
            let conditionsIds = [];

            if(gColumnActions[arch.Bit2Archetypes__External_Id__c]){
                actionsIds = gColumnActions[arch.Bit2Archetypes__External_Id__c].map((colact)=>{
                    return colact.Bit2Archetypes__Archetype_Action__r.Bit2Archetypes__External_Id__c;
                });
            }

            if(gColumnConditions[arch.Bit2Archetypes__External_Id__c]){
                conditionsIds = gColumnConditions[arch.Bit2Archetypes__External_Id__c].map((colcond)=>{
                    return colcond.Bit2Archetypes__Archetype_Condition__r.Bit2Archetypes__External_Id__c;
                })
            }

            logger.debug(`Action Ids..${JSON.stringify(actionsIds)}`);
            logger.debug(`Condition Ids...${JSON.stringify(conditions)}`);

            singleArchetypeJson[constants.ACTION_OBJECT_KEY] = actions.filter((act)=>{
                return actionsIds.includes(act.Bit2Archetypes__External_Id__c);
            })

            singleArchetypeJson[constants.CONDITION_OBJECT_KEY] = conditions.filter((cond)=>{
                return conditionsIds.includes(cond.Bit2Archetypes__External_Id__c);
            })

            singleArchetypeJson[constants.ACTION_PARAM_OBJECT_KEY] = actionParams.filter((ap)=>{
                return actionsIds.includes(ap.Bit2Archetypes__Archetype_Action__r.Bit2Archetypes__External_Id__c);
            });

            singleArchetypeJson[constants.CONDITION_PARAM_OBJECT_KEY] = conditionParams.filter((cp)=>{
                    return conditionsIds.includes(cp.Bit2Archetypes__Archetype_Condition__r.Bit2Archetypes__External_Id__c);
            })

            //associating steps
            singleArchetypeJson[constants.ACTION_STEP_OBJECT_KEY] = actionSteps.filter((step)=>{
                return actionsIds.includes(step.Bit2Archetypes__Archetype_Action__r.Bit2Archetypes__External_Id__c);
            })

            result.push(singleArchetypeJson);
        }catch(ex){
            logger.error(utility.printError(ex));
        }
    }

    return result;

}


function recreateCSVFromJSON(b2wprojectpath = BASE_PROJECT_PATH){

    try{
        const archetypeFiles = readArchetypeFileOnSubDirs(b2wprojectpath);
        const individualFilesMap = {};
        for(const archetype of archetypeFiles){
            delete archetype['name'];
            for(const objectKey of Object.keys(archetype)){
                if(individualFilesMap.hasOwnProperty(objectKey + ".csv")){
                    if(Array.isArray(archetype[objectKey])){
                        if(archetype[objectKey].length>0){
                            for(const archObj of archetype[objectKey]){
                                individualFilesMap[objectKey + ".csv"].push(manipulateJsonForCSVReExport(archObj));
                            }      
                        }
                    }else{
                        individualFilesMap[objectKey + ".csv"].push(manipulateJsonForCSVReExport(archetype[objectKey]))
                    }
                }else{
                    individualFilesMap[objectKey + ".csv"] = [];
                    if(Array.isArray(archetype[objectKey])){
                        if(archetype[objectKey].length>0){
                            for(const archObj of archetype[objectKey]){
                                individualFilesMap[objectKey + ".csv"].push(manipulateJsonForCSVReExport(archObj));
                            }   
                        }
                    }else{
                        individualFilesMap[objectKey + ".csv"].push(manipulateJsonForCSVReExport(archetype[objectKey]));
                    }
                }
            }
        }
        return individualFilesMap;
    }catch(ex){
        logger.error(utility.printError(ex));
    }
}


function manipulateJsonForCSVReExport(recordJson){
    const resultCopy = {...recordJson};
    for(const okey of Object.keys(recordJson)){
        if(typeof recordJson[okey]==='object'){
            delete resultCopy[okey];
            let subObjSingleKey = Object.keys(recordJson[okey])[0];
            let newKey = `${okey}.${subObjSingleKey}`;
            resultCopy[newKey] = recordJson[okey][subObjSingleKey];
        }
    }
    logger.debug(`Current manipulated json archetype for export : ${JSON.stringify(resultCopy)}`)
    return resultCopy;
}

async function writeExportCSVToFile(jsonFileMap,generateArtifact,timestamp=false){

    if(!generateArtifact){
        //moving the recordtype file which is needed for import
        const rtFileNameSrc = join(constants.UTIL_DATA_BASE_FOLDER,'util_data','RecordType.csv');
        const rtFileNameTarget = join(IMPORT_PROJECT_PATH,'RecordType.csv');
        fs.copyFileSync(rtFileNameSrc,rtFileNameTarget);
        const csvWriteResult = await writeCSV(jsonFileMap,IMPORT_PROJECT_PATH,rtFileNameSrc);
    }else{
        generateArtifactCSVStructures(jsonFileMap,timestamp);
    }
}


async function generateArtifactCSVStructures(jsonfileMap,timestamp){
    try{
        const artifactPath = createArtifactDirectoryStructure(constants.CURRENT_WORK_DIR,timestamp);
        logger.debug(`Artifact Structure Created --> ${artifactPath}`);

        //copying the export.json
        fs.copyFileSync(join(IMPORT_PROJECT_PATH,'export.json'),join(artifactPath,'export.json'));


        //copying the recordtype files
        const rtFileNameSrc = join(constants.UTIL_DATA_BASE_FOLDER,'util_data','RecordType.csv');
        const rtFileNameTarget = join(artifactPath,'RecordType.csv');
        fs.copyFileSync(rtFileNameSrc,rtFileNameTarget);

        const csvWriteResult = await writeCSV(jsonfileMap,artifactPath,rtFileNameSrc);
    }catch(ex){
        logger.error(utility.printError(ex));
    }

}


async function writeCSV(jsonFileMap,path,rtPath){

    //v1.2.0 added recordtype mapping file path

    logger.debug('Starting csv writing...');
    logger.debug(`currentJSON fileMap ${JSON.stringify(jsonFileMap)}`);

    //reconstruction of output csv also with not "connected records"
    const exportJsonContents = await readMultipleCSV(EXTRACTED_FILE_PATH);
    const recordTypesList = await readSingleCSV(rtPath,'RecordTypes');
    const rtGrouping = _.groupBy(recordTypesList['RecordTypes'],'$$DeveloperName$NamespacePrefix$SobjectType');

    logger.debug(`RecordType Mappings ${JSON.stringify(recordTypesList)}`);
    logger.debug(`Exported Json Contents ${JSON.stringify(exportJsonContents)}`);


    //adding eventually excluded records in jsonfilemap to recreate csv correctly
    for(const jsonMapKey of Object.keys(jsonFileMap)){

        const exportJsonKey = `${jsonMapKey.substring(0,jsonMapKey.lastIndexOf('.'))}${constants.TARGET_FILE_EXTENSION_FINAL}`;
        const exportJsonObjList = exportJsonContents[exportJsonKey];
        const jsonMapObjList = jsonFileMap[jsonMapKey];

        //mapping lists by extids
        const exportMapping = _.groupBy(exportJsonObjList,'Bit2Archetypes__External_Id__c');
        const deployFileMapping = _.groupBy(jsonMapObjList,'Bit2Archetypes__External_Id__c');

        for(const exportMappingExtId of Object.keys(exportMapping)){
            const currentRecord = exportMapping[exportMappingExtId][0];
            if(!Object.keys(deployFileMapping).includes(exportMappingExtId)){
                jsonMapObjList.push(currentRecord);
            }
        }

        //v1.2.0 remapping recordtype ids
        for(const jsonObj of jsonMapObjList){
            if(jsonObj.RecordTypeId){
                jsonObj['RecordTypeId'] = rtGrouping[jsonObj.RecordTypeId][0].Id; 
            }
        }
    }

    for(const jsonMapKey of Object.keys(jsonFileMap)){
        //fix header quoting
        let csv = await parseAsync(jsonFileMap[jsonMapKey]);
        let csvLines = csv.split('\n');
        
        let csvHeader = csvLines[0];

        logger.debug(`current csv file header (file ${jsonMapKey}): ${csvHeader} `);

        const find = '"';
        const re = new RegExp(find, 'g');
        csvHeader = csvHeader.replace(re,'');

        csvLines.shift();
        csv = [csvHeader,...csvLines].join('\n');

        const out = fs.writeFile(join(path,jsonMapKey),csv,(err)=>{
            if(err){
                logger.error(utility.printError(err));
            }
        });
    }
}




function readMultipleCSV (dirname){
    return new Promise(async (resolve,reject)=>{
        const rawFileData = readFilesAsObject(dirname);
        const resultObject = {};
        for(const k of Object.keys(rawFileData)){
            let fileContent = rawFileData[k];
            const csvDataAsJson = await csv().fromString(fileContent);
            resultObject[k] = csvDataAsJson;
        }
        resolve(resultObject);
    })
}

function readSingleCSV (filepath,key){
    return new Promise(async (resolve,reject)=>{
        const rawFileData = fs.readFileSync(filepath).toString();
        logger.debug(`single csv filedata ${rawFileData}`);
        const resultObject = {}
        const csvDataAsJson = await csv().fromString(rawFileData);
        resultObject[key]= csvDataAsJson;
        resolve(resultObject);
    })
}




