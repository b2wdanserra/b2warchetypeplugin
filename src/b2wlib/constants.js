const {join} = require('path');

module.exports = {
    "PROJECT_ROOT" : __dirname,
    "UTIL_DATA_BASE_FOLDER" : join(__dirname,'..','..','src','b2wlib'),
    "CURRENT_WORK_DIR" : process.cwd(),
    "ARCHTYPE_FOLDER_NAME" : "archetypes",
    "ARCHTYPE_OBJECT_KEY" : "Bit2Archetypes__Archetype__c",
    "COLUMN_COND_OBJECT_KEY": "Bit2Archetypes__Archetype_Column_Condition__c",
    "COLUMN_ACT_OBJECT_KEY": "Bit2Archetypes__Archetype_Column_Action__c",
    "ACTION_OBJECT_KEY" : "Bit2Archetypes__Archetype_Action__c",
    "CONDITION_OBJECT_KEY" : "Bit2Archetypes__Archetype_Condition__c",
    "ACTION_STEP_OBJECT_KEY": "Bit2Archetypes__Archetype_Action_Step__c",
    "ACTION_PARAM_OBJECT_KEY" : "Bit2Archetypes__Archetype_Action_Parameter__c",
    "CONDITION_PARAM_OBJECT_KEY" : "Bit2Archetypes__Archetype_Condition_Parameter__c",
    "TARGET_FILE_EXTENSION_FINAL" : "_readonly_target.csv",
    "IMPORT_FILE_EXTENSION_FINAL" : "_upsert_source.csv",
    "ORG_ALIAS" : "B2WLAB",
    "ARTIFACT_FOLDER_PREFIX" : "b2w_arch_artifact"
}