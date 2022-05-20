const constants = require('../../constants');
const archetypemanager = require('../b2w/archetypemanager');
const fs = require('fs-extra');
const {join} = require('path');
const _ = require('lodash');
const logger = require('../logger');
const utility = require('../utility');
const csvmanager = require('./csvmanager');

const {readFilesAsObject,createDirectoryIfNotExists} = require('./shared_utils');





module.exports.createArchetypeBundleDirectories = async (archetypeData,b2wprojectpath = constants.PROJECT_ROOT)=>{
    const archetypeBaseFolderPath = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME);
    //create archetype base folder
    createDirectoryIfNotExists(archetypeBaseFolderPath);
    if(archetypeData){
        //creating subfolder if archetype data is already downloaded
        for(const arch of archetypeData){
            createDirectoryIfNotExists(join(archetypeBaseFolderPath,arch.name));
        }
    }
    return archetypeBaseFolderPath;
}

module.exports.populateArchetypeBundleFolder = (archetypeBaseFolderPath,bundleData)=>{
    for(const bundle of bundleData){

        logger.debug(`Processing archetype bundle with name: ${bundle.name}`)

        // creating bundle subdirs
        createDirectoryIfNotExists(join(archetypeBaseFolderPath,bundle.name,'conditions'));
        createDirectoryIfNotExists(join(archetypeBaseFolderPath,bundle.name,'steps'));

        // creating json file first
        fs.writeFileSync(join(archetypeBaseFolderPath,bundle.name,`${bundle.name}.json`),JSON.stringify(bundle,null,"\t"));

        //creating steps files
        for(const step of bundle.Bit2Archetypes__Archetype_Action_Step__c){
            const stepContent = String(step.Bit2Archetypes__Template__c);
            fs.writeFileSync(join(archetypeBaseFolderPath,bundle.name,'steps',`${step.Name}_${step.Bit2Archetypes__External_Id__c}.js`),stepContent);
        }

        //creating condition files
        for(const cond of bundle.Bit2Archetypes__Archetype_Condition__c){
            const conditionContent = String(cond.Bit2Archetypes__Template__c);
            fs.writeFileSync(join(archetypeBaseFolderPath,bundle.name,'conditions',`${cond.Bit2Archetypes__Label__c}_${cond.Bit2Archetypes__External_Id__c}.txt`),conditionContent);
        }
    }
}


module.exports.updateArchetypeFile = async(archetypeName,orgAlias,b2wprojectpath = constants.PROJECT_ROOT) => {

    try{

        const archetypeFolderName = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypeName); //`${b2wprojectpath}\\${constants.ARCHTYPE_FOLDER_NAME}\\${archetypeName}`;
        const archetypeConditionsFolderName = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypeName,'conditions');
        const archetypeStepsFolderName = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypeName,'steps');
    
        const archetypeJsonFileName = join(archetypeFolderName,`${archetypeName}.json`);


        //first we re-extract the file from org to update the reference ids
        let archetypeJsonFile;
        const getArchetypeStructureFromOrgResult = await csvmanager.reAlignArchetypeMetadataJSONWithOrg(archetypeName,orgAlias);
        
        if(getArchetypeStructureFromOrgResult){
            archetypeJsonFile = getArchetypeStructureFromOrgResult;
        }else{
            archetypeJsonFile = JSON.parse(fs.readFileSync(archetypeJsonFileName));
        }

        const archetypeSource = archetypeJsonFile.Bit2Archetypes__Archetype__c.Bit2Archetypes__External_Id__c.startsWith('b2wvsc_') ?
        'tool' : 'sfdc';

    
        //read the conditions and steps file, then modify the original json
        const steps = readFilesAsObject(archetypeStepsFolderName);
        const conditions = readFilesAsObject(archetypeConditionsFolderName);
        const oldSteps = _.groupBy(archetypeJsonFile[constants.ACTION_STEP_OBJECT_KEY],'Bit2Archetypes__External_Id__c');
        const oldConditions = _.groupBy(archetypeJsonFile[constants.CONDITION_OBJECT_KEY],'Bit2Archetypes__External_Id__c');
        const oldColumnConditions = _.groupBy(archetypeJsonFile[constants.COLUMN_COND_OBJECT_KEY],'Bit2Archetypes__Archetype_Condition__r.Bit2Archetypes__External_Id__c');
        const oldColumnActions = _.groupBy(archetypeJsonFile[constants.COLUMN_ACT_OBJECT_KEY],'Bit2Archetypes__Archetype_Action__r.Bit2Archetypes__External_Id__c');

        logger.debug(`Found archetype conditions : ${JSON.stringify(conditions)}`);
        logger.debug(`Found archetype conditions with keys : ${JSON.stringify(Object.keys(conditions))}`);
    
        //getting variables by condition notation
        let fullConditionVariablesPath = "";
        let fullConditionVariables = "";
        for(const cKey of Object.keys(conditions)){
            logger.debug(`Getting variables mapping on condition with file key : ${cKey}`);
            logger.debug(`Getting variables mapping on condition ${conditions[cKey]}`);
            fullConditionVariablesPath += archetypemanager.extractVariablesFromConditionsMapping(conditions[cKey]);
        }
        for(const cKey of Object.keys(conditions)){
            logger.debug(`Getting variables on condition with file key : ${cKey}`);
            logger.debug(`Getting variables on condition ${conditions[cKey]}`);
            fullConditionVariables += archetypemanager.extractVariablesFromConditions(conditions[cKey]);
        }


        //updating conditions
        for(const cKey of Object.keys(conditions)){
            const currentCondId = cKey.substring(cKey.lastIndexOf('_')+1,cKey.lastIndexOf('.txt'));

            logger.debug(`Updating condition on json with id : ${currentCondId}`);

            const currentCondVariablesPath = archetypemanager.extractVariablesFromConditionsMapping(conditions[cKey]);
            const currentConditionVariables = archetypemanager.extractVariablesFromConditions(conditions[cKey]);
            oldConditions[currentCondId][0].Bit2Archetypes__Template__c = conditions[cKey];
            oldConditions[currentCondId][0].Bit2Archetypes__Variables__c = currentConditionVariables;
            //oldColumnConditions[currentCondId][0].Bit2Archetypes__Object_Mapping__c = currentCondVariablesPath;
            
        }
        

        //updating actions
        for(const sKey of Object.keys(steps)){
            let currentStepId;
            if(sKey.includes('b2wvsc')){
                currentStepId = sKey.substring(sKey.lastIndexOf('b2wvsc_'),sKey.lastIndexOf('.js'));
            }else{
                currentStepId = sKey.substring(sKey.lastIndexOf('_')+1,sKey.lastIndexOf('.js'));
            }

            logger.debug(`updating step with id ${currentStepId}`);

            oldSteps[currentStepId][0].Bit2Archetypes__Template__c = steps[sKey]; 
            //oldSteps[currentStepId][0].Bit2Archetypes__Action_Objs__c = fullConditionVariables;
            //oldColumnActions[oldSteps[currentStepId][0].Bit2Archetypes__Archetype_Action__r.Bit2Archetypes__External_Id__c][0].Bit2Archetypes__Object_Mapping__c = fullConditionVariablesPath;
        }
        
    
        const newSteps = [].concat.apply([], Object.values(oldSteps));
        const newConds = [].concat.apply([], Object.values(oldConditions));
        const newColConds = [].concat.apply([], Object.values(oldColumnConditions));
        const newColActs = [].concat.apply([], Object.values(oldColumnActions));
    
        const newJsonArchetype = {
            ...archetypeJsonFile,
            [constants.ACTION_STEP_OBJECT_KEY]:newSteps,
            [constants.CONDITION_OBJECT_KEY]:newConds,
            [constants.COLUMN_ACT_OBJECT_KEY]:newColActs,
            [constants.COLUMN_COND_OBJECT_KEY]:newColConds
        };
    
        fs.writeFileSync(archetypeJsonFileName,JSON.stringify(newJsonArchetype,null,"\t"));
    }catch(ex){
        logger.error(utility.printError(ex));
        // throw new Error(ex.message);
    }
}


module.exports.readFilesAsObject = readFilesAsObject;


// module.exports.readArchetypeFileOnSubDirs = (b2wprojectpath = constants.PROJECT_ROOT) =>{
//     try{
//         const result = [];
//         const archetypeBaseFolderPath = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME); //`${b2wprojectpath}\\${constants.ARCHTYPE_FOLDER_NAME}`;
//         const folders = fs.readdirSync(archetypeBaseFolderPath);
//         folders.forEach((folderName)=>{
//             const archetypeBundleFiles = fs.readdirSync(join(archetypeBaseFolderPath,folderName));
//             archetypeBundleFiles.forEach((fileName)=>{
//                 if(fileName===`${folderName}.json`){
//                     const file = fs.readFileSync(join(archetypeBaseFolderPath,folderName,fileName),'utf-8');
//                     result.push(JSON.parse(file));
//                 }
//             })
//         });
//         return result
//     }catch(ex){
//             logger.error(ex);
//     }

// }

// module.exports.createArtifactDirectoryStructure = (path = constants.CURRENT_WORK_DIR,timestamp = false) =>{
//     try{
//         const rootArtifactFolderPath = timestamp 
//         ? join(path,`${constants.ARTIFACT_FOLDER_PREFIX}_${new Date().getTime()}`)
//         : join(path,constants.ARTIFACT_FOLDER_PREFIX);
        
//         const logDirectoryPath = join(rootArtifactFolderPath,'logs');
//         const sourceDirectoryPath = join(rootArtifactFolderPath,'source');
//         const targetDirectoryPath = join(rootArtifactFolderPath,'target'); 
//         //creating the directory structure
//         createDirectoryIfNotExists(rootArtifactFolderPath);
//         createDirectoryIfNotExists(logDirectoryPath);
//         createDirectoryIfNotExists(sourceDirectoryPath);
//         createDirectoryIfNotExists(targetDirectoryPath);

//         return rootArtifactFolderPath;

//     }catch(ex){
//         logger.error(ex);
//     }
// }

module.exports.checkBundleExistence = (archetypename,b2wprojectpath = constants.CURRENT_WORK_DIR)=>{
    const archetypeFolderName = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypename);
    return fs.existsSync(archetypeFolderName)
}


module.exports.readBundleJsonFile = async (archetypename,orgalias,b2wprojectpath = constants.CURRENT_WORK_DIR)=>{

    const archetypeJsonFromOrg = await csvmanager.reAlignArchetypeMetadataJSONWithOrg(archetypename,orgalias);

    if(archetypeJsonFromOrg){
        return JSON.stringify(archetypeJsonFromOrg);
    }

    const requestedArchetypeBundlePath = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypename,`${archetypename}.json`);
    return fs.readFileSync(requestedArchetypeBundlePath,'utf-8');
}



module.exports.createArchetypeBoilerplate = (path = constants.CURRENT_WORK_DIR,opts) => {
    
    //generating ids for the new boilerplate
    const archExtId = utility.generatebase16UUID();
    const columnCondExtId = utility.generatebase16UUID();
    const columnActExtId = utility.generatebase16UUID();
    const condExtId = utility.generatebase16UUID();
    const actExtId = utility.generatebase16UUID();
    const stepExtId = utility.generatebase16UUID();


    //managing rts
    const {recordtypes} = opts;
    const rtMapping = {};
    for(const rt of recordtypes){
        rtMapping[rt.SobjectType]= rt.Id;
    }

    if(!opts){
        opts = {
            archetypename : 'new_archetype',
            recordtypes : {},
            stepname : 'action_step_1',
            agendagroup : 'agAlways',
            conditionname : 'condition',
            actionname  : 'action'
        }
    }
    //adding the generated ids to the options
    opts = {
        ...opts,
        archExtId,
        columnCondExtId,
        columnActExtId,
        condExtId,
        actExtId,
        stepExtId,
        recordtypes : rtMapping,
        stepname : 'action_step_1',

    };
    const archetypeJson = archetypemanager.generateArchetypeJsonBoilerPlate(opts);

    //creating the files and folders
    const archetypeBaseFolder = join(path,'archetypes');
    const archetypeFolder = join(archetypeBaseFolder,opts.archetypename);
    createDirectoryIfNotExists(archetypeFolder);
    this.populateArchetypeBundleFolder(archetypeBaseFolder,[archetypeJson]);
}


module.exports.addConditionToBundle = async (opts,path = constants.CURRENT_WORK_DIR) => {
    const {archetypename,conditionname,recordtypes,orgalias} = opts;

    const rtMapping = {};
    for(const rt of recordtypes){
        rtMapping[rt.SobjectType]= rt.Id;
    }

    const condExtId = utility.generatebase16UUID();
    const condopts = {
        condExtId,
        conditionname,
        rtMapping,
        bundlejsonstr : await this.readBundleJsonFile(archetypename,orgalias)
    };
    const updatedBundleJson = archetypemanager.addarchetypeconditiontobundle(condopts);

    //creating the condition file and updating the json
    const bundleLocation = join(path,constants.ARCHTYPE_FOLDER_NAME,archetypename);
    const conditionFolder = join(bundleLocation,'conditions');
    const conditionFileName = join(conditionFolder,`${conditionname}_${condExtId}.txt`);
    const conditionContent = archetypemanager.generatePlaceHolderCondition();
    fs.writeFileSync(conditionFileName,conditionContent);
    fs.writeFileSync(join(bundleLocation,`${archetypename}.json`),JSON.stringify(updatedBundleJson,null,"\t"));
    
}

module.exports.addActionToBundle = async (opts,path = constants.CURRENT_WORK_DIR) => {
    const {archetypename,actionname,recordtypes,orgalias} = opts;

    const rtMapping = {};
    for(const rt of recordtypes){
        rtMapping[rt.SobjectType]= rt.Id;
    }
    const actExtId = utility.generatebase16UUID();
    const actopts = {
        actExtId,
        actionname,
        rtMapping,
        bundlejsonstr : await this.readBundleJsonFile(archetypename,orgalias)
    };
    const updatedBundleJson = archetypemanager.addarchetypeactiontobundle(actopts);
    const bundleLocation = join(path,constants.ARCHTYPE_FOLDER_NAME,archetypename);
    fs.writeFileSync(join(bundleLocation,`${archetypename}.json`),JSON.stringify(updatedBundleJson,null,"\t"));
}

module.exports.addActionStepToBundle = async (opts,path = constants.CURRENT_WORK_DIR) => {
    const {archetypename,actionname,recordtypes,stepname,sequence,orgalias} = opts;
    const rtMapping = {};
    for(const rt of recordtypes){
        rtMapping[rt.SobjectType]= rt.Id;
    }
    const stepExtId = utility.generatebase16UUID();
    const stepopts = {
        stepname,
        stepExtId,
        actionname,
        rtMapping,
        sequence,
        bundlejsonstr : await this.readBundleJsonFile(archetypename,orgalias)
    };
    const updatedBundleJson = archetypemanager.addarchetypeactionsteptobundle(stepopts);
    const bundleLocation = join(path,constants.ARCHTYPE_FOLDER_NAME,archetypename);
    const stepContent = archetypemanager.generatePlaceHolderActionStep();
    const stepFolder = join(bundleLocation,'steps');
    const stepFileName = join(stepFolder,`${stepname}_${stepExtId}.js`);
    fs.writeFileSync(stepFileName,stepContent);
    fs.writeFileSync(join(bundleLocation,`${archetypename}.json`),JSON.stringify(updatedBundleJson,null,"\t"));
}


module.exports.associateExistingActionToArchetype = async (opts,path = constants.CURRENT_WORK_DIR) => {
    const {archetypename,actionExtId,recordtypes,sequence,orgalias} = opts;
    const rtMapping = {};
    for(const rt of recordtypes){
        rtMapping[rt.SobjectType]= rt.Id;
    }
    const columnActExtId = utility.generatebase16UUID();

    const colActOpts = {
        actionExtId,
        columnActExtId,
        rtMapping,
        sequence,
        bundlejsonstr : await this.readBundleJsonFile(archetypename,orgalias)
    };

    const updatedBundleJson = archetypemanager.associateactiontobundle(opts);
    const bundleLocation = join(path,constants.ARCHTYPE_FOLDER_NAME,archetypename);
    fs.writeFileSync(join(bundleLocation,`${archetypename}.json`),JSON.stringify(updatedBundleJson,null,"\t"));
}





// function createDirectoryIfNotExists (dirpath){
//     if(!fs.existsSync(dirpath)){
//         fs.mkdirSync(dirpath);
//     }
// }

// function readFilesAsObject(dirname){
//     const rawFileData = {};
//     const fileNames = fs.readdirSync(dirname);
//     fileNames.forEach((fileName)=>{
//         const file = fs.readFileSync(join(dirname,fileName),'utf-8');
//         rawFileData[fileName] = file;
//     });
//     return rawFileData;
// }

