const fs = require('fs');
const {join} = require('path');
const logger = require('../logger');
const constants = require('../../constants');



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



module.exports.createDirectoryIfNotExists = function (dirpath){
    if(!fs.existsSync(dirpath)){
        fs.mkdirSync(dirpath);
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




module.exports.readFilesAsObject = function (dirname){
    const rawFileData = {};
    const fileNames = fs.readdirSync(dirname);
    fileNames.forEach((fileName)=>{
        const file = fs.readFileSync(join(dirname,fileName),'utf-8');
        rawFileData[fileName] = file;
    });
    return rawFileData;
}

