const constants = require('../../constants');
const archetypemanager = require('../b2w/archetypemanager');
const fs = require('fs');
const {join} = require('path');
const _ = require('lodash');
const logger = require('../logger');




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
            fs.writeFileSync(join(archetypeBaseFolderPath,bundle.name,'conditions',`${cond.Bit2Archetypes__Label__c}_${cond.Id}.txt`),conditionContent);
        }
    }
}


module.exports.updateArchetypeFile = (archetypeName,b2wprojectpath = constants.PROJECT_ROOT) => {

    try{
        const archetypeFolderName = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypeName); //`${b2wprojectpath}\\${constants.ARCHTYPE_FOLDER_NAME}\\${archetypeName}`;
        const archetypeConditionsFolderName = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypeName,'conditions');
        const archetypeStepsFolderName = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME,archetypeName,'steps');
    
        const archetypeJsonFileName = join(archetypeFolderName,`${archetypeName}.json`);
        const archetypeJsonFile = JSON.parse(fs.readFileSync(archetypeJsonFileName));
    
        //read the conditions and steps file, then modify the original json
        const steps = readFilesAsObject(archetypeStepsFolderName);
        const conditions = readFilesAsObject(archetypeConditionsFolderName);
        const oldSteps = _.groupBy(archetypeJsonFile[constants.ACTION_STEP_OBJECT_KEY],'Id');
        const oldConditions = _.groupBy(archetypeJsonFile[constants.CONDITION_OBJECT_KEY],'Id');
        const oldColumnConditions = _.groupBy(archetypeJsonFile[constants.COLUMN_COND_OBJECT_KEY],'Bit2Archetypes__Archetype_Condition__c');
        const oldColumnActions = _.groupBy(archetypeJsonFile[constants.COLUMN_ACT_OBJECT_KEY],'Bit2Archetypes__Archetype_Action__c');

    
        //getting variables by condition notation
        let fullConditionVariablesPath = "";
        let fullConditionVariables = "";
        for(const cKey of Object.keys(conditions)){
            fullConditionVariablesPath += archetypemanager.extractVariablesFromConditionsMapping(conditions[cKey]);
        }
        for(const cKey of Object.keys(conditions)){
            fullConditionVariables += archetypemanager.extractVariablesFromConditions(conditions[cKey]);
        }
    
        //updating conditions
        for(const cKey of Object.keys(conditions)){
            const currentCondId = cKey.substring(cKey.lastIndexOf('_')+1,cKey.lastIndexOf('.txt'));
            const currentCondVariablesPath = archetypemanager.extractVariablesFromConditionsMapping(conditions[cKey]);
            const currentConditionVariables = archetypemanager.extractVariablesFromConditions(conditions[cKey]);
            oldConditions[currentCondId][0].Bit2Archetypes__Template__c = conditions[cKey];
            oldConditions[currentCondId][0].Bit2Archetypes__Variables__c = currentConditionVariables;
            oldColumnConditions[currentCondId][0].Bit2Archetypes__Object_Mapping__c = currentCondVariablesPath;
            
        }
        

        //updating actions
        for(const sKey of Object.keys(steps)){
            const currentStepId = sKey.substring(sKey.lastIndexOf('_')+1,sKey.lastIndexOf('.js'));
            oldSteps[currentStepId][0].Bit2Archetypes__Template__c = steps[sKey]; 
            oldSteps[currentStepId][0].Bit2Archetypes__Action_Objs__c = fullConditionVariables;
            oldColumnActions[oldSteps[currentStepId][0].Bit2Archetypes__Archetype_Action__c][0].Bit2Archetypes__Object_Mapping__c = fullConditionVariablesPath;
        }
        
    
        //TODO: fix this
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
        throw new Error(ex.message);
    }
}


module.exports.readFilesAsObject = readFilesAsObject;


module.exports.readArchetypeFileOnSubDirs = (b2wprojectpath = constants.PROJECT_ROOT) =>{
    try{
        const result = [];
        const archetypeBaseFolderPath = join(b2wprojectpath,constants.ARCHTYPE_FOLDER_NAME); //`${b2wprojectpath}\\${constants.ARCHTYPE_FOLDER_NAME}`;
        const folders = fs.readdirSync(archetypeBaseFolderPath);
        folders.forEach((folderName)=>{
            const archetypeBundleFiles = fs.readdirSync(join(archetypeBaseFolderPath,folderName));
            archetypeBundleFiles.forEach((fileName)=>{
                if(fileName===`${folderName}.json`){
                    const file = fs.readFileSync(join(archetypeBaseFolderPath,folderName,fileName),'utf-8');
                    result.push(JSON.parse(file));
                }
            })
        });
        return result
    }catch(ex){
            logger.error(ex);
    }

}

module.exports.createArtifactDirectoryStructure = (path = constants.CURRENT_WORK_DIR,timestamp = false) =>{
    try{
        const rootArtifactFolderPath = timestamp 
        ? join(path,`${constants.ARTIFACT_FOLDER_PREFIX}_${new Date().getTime()}`)
        : join(path,constants.ARTIFACT_FOLDER_PREFIX);
        
        const logDirectoryPath = join(rootArtifactFolderPath,'logs');
        const sourceDirectoryPath = join(rootArtifactFolderPath,'source');
        const targetDirectoryPath = join(rootArtifactFolderPath,'target'); 
        //creating the directory structure
        createDirectoryIfNotExists(rootArtifactFolderPath);
        createDirectoryIfNotExists(logDirectoryPath);
        createDirectoryIfNotExists(sourceDirectoryPath);
        createDirectoryIfNotExists(targetDirectoryPath);

        return rootArtifactFolderPath;

    }catch(ex){
        logger.error(ex);
    }
}


function createDirectoryIfNotExists (dirpath){
    if(!fs.existsSync(dirpath)){
        fs.mkdirSync(dirpath);
    }
}

function readFilesAsObject(dirname){
    const rawFileData = {};
    const fileNames = fs.readdirSync(dirname);
    fileNames.forEach((fileName)=>{
        const file = fs.readFileSync(join(dirname,fileName),'utf-8');
        rawFileData[fileName] = file;
    });
    return rawFileData;
}