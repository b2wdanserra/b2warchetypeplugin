const utility = require('../utility');
const logger = require('../logger');
const _ = require('lodash');

module.exports.extractVariablesFromConditionsMapping = (conditionCode) => {
    let variables = "";
    const specialChars = ['\n','\t','\r'];
    //splitting condition code lines by semicolon
    const conditionLines = conditionCode.split(";");
    //getting variables
    for(const cond of conditionLines){
        if(cond && cond!=='' && !specialChars.includes(cond) && !cond.startsWith('not')){
            let fullCond = cond.split(":")[1].trim();
            let defineObj = fullCond.includes('(') ? fullCond.substring(0,fullCond.indexOf('(')).trim() : fullCond;
            let variableMarker = cond.split(":")[0].trim();
            let variableName = variableMarker.substring(variableMarker.indexOf("{%")+2,variableMarker.lastIndexOf("%}"));
            variables+=`${variableName}:${defineObj}:${variableName};`;
        }
    }
    logger.debug(`Current condition variables mapping : ${variables}`);
    return variables;
}

module.exports.extractVariablesFromConditions = (conditionCode) => {
    let variables = "";
    //splitting condition code lines by semicolon
    const conditionLines = conditionCode.split(";");
    const specialChars = ['\n','\t','\r'];
    //getting variables
    for(const cond of conditionLines){
        if(cond && cond!=='' && !specialChars.includes(cond) && !cond.startsWith('not')){
            let fullCond = cond.split(":")[1].trim();
            let defineObj = fullCond.includes('(') ? fullCond.substring(0,fullCond.indexOf('(')).trim() : fullCond;
            let variableMarker = cond.split(":")[0].trim();
            let variableName = variableMarker.substring(variableMarker.indexOf("{%")+2,variableMarker.lastIndexOf("%}"));
            variables+=`${variableName}:${defineObj};`;
        }
    }
    logger.debug(`Current extracted variables ${variables}`);
    return variables;
}

module.exports.generatePlaceHolderActionStep = () => {
    return `/*this a boilerplate action step, plase modify step and condition accordingly to your needs*/\nmodify(con, function(){\n\tconsole.log('test');\n});`;
}
module.exports.generatePlaceHolderCondition = ()=>{
    return `con : contextdata;\n`
}

module.exports.generateArchetypeJsonBoilerPlate = (opts) => {

    const {
        archetypename,
        recordtypes,
        stepname,
        agendagroup,
        conditionname,
        actionname,
        archExtId,
        columnCondExtId,
        columnActExtId,
        condExtId,
        actExtId,
        stepExtId
    } = opts;

    //generating ids

    return {
        "name": archetypename,
        "Bit2Archetypes__Archetype__c": {
            "Id": archExtId,
            "RecordTypeId": recordtypes['Bit2Archetypes__Archetype__c'],
            "Bit2Archetypes__Archetype_Process__c": "Live",
            "Bit2Archetypes__Archetype_Script__c": "",
            "Bit2Archetypes__External_Id__c": archExtId,
            "Bit2Archetypes__Name__c": archetypename,
            "Bit2Archetypes__Type__c": "",
            "Bit2Archetypes__Agenda_Group__c": agendagroup,
            "Bit2Archetypes__Allow_loop__c": "false",
            "Bit2Archetypes__Federated__c": "false",
            "Bit2Archetypes__Optimized__c": "false",
            "RecordType": {
                "$$DeveloperName$NamespacePrefix$SobjectType": "B2Wgin;Bit2Archetypes;Bit2Archetypes__Archetype__c"
            }
        },
        "Bit2Archetypes__Archetype_Column_Condition__c": [
            this.generateColConditionJsonPlaceHolder({
                columnCondExtId,
                archExtId,
                condExtId,
                sequence : "0"
            })
        ],
        "Bit2Archetypes__Archetype_Column_Action__c": [
            this.generateColActionJsonPlaceHolder({
                archExtId,
                columnActExtId,
                actExtId,
                sequence : "0"
            })
        ],
        "Bit2Archetypes__Archetype_Action__c": [
            this.generateActionJsonPlaceHolder({
                actExtId,
                actionname,
                rtId : recordtypes['Bit2Archetypes__Archetype_Action__c'],
            })
        ],
        "Bit2Archetypes__Archetype_Condition__c": [
            this.generateConditionJsonPlaceHolder({
                condExtId,
                rtId : recordtypes['Bit2Archetypes__Archetype_Condition__c'],
                conditionname
            })
        ],
        "Bit2Archetypes__Archetype_Action_Parameter__c": [],
        "Bit2Archetypes__Archetype_Condition_Parameter__c": [],
        "Bit2Archetypes__Archetype_Action_Step__c": [
            this.generateActionStepJsonPlaceHolder({
                stepExtId,
                stepname,
                actExtId,
                sequence : 1,
                rtId : recordtypes['Bit2Archetypes__Archetype_Action_Step__c']
            })
        ]
    }
}


module.exports.addarchetypeconditiontobundle = (opts) => {
    const {bundlejsonstr,condExtId,conditionname,rtMapping} = opts;
    const parsedJson = JSON.parse(bundlejsonstr);

    //getting existing conditions to calculate sequence
    let existingConditions = parsedJson['Bit2Archetypes__Archetype_Column_Condition__c'];
    let sequence = "0";
    if(existingConditions.length!==0){
        existingConditions = _.sortBy(existingConditions,(act)=>{return act['Bit2Archetypes__Visualization_Sequence__c']});
        sequence = String(Number(existingConditions.slice(-1).pop()['Bit2Archetypes__Visualization_Sequence__c']) + 1);
    }

    //cloning the current condition json and creating a boilerplate
    const newConditionObj = this.generateConditionJsonPlaceHolder({condExtId,
        conditionname,
        rtId : rtMapping['Bit2Archetypes__Archetype_Condition__c']
    });
    //updating and returning the json, add the column condition
    const newColConditionObj = this.generateColConditionJsonPlaceHolder({
        condExtId,
        columnCondExtId : utility.generatebase16UUID(),
        archExtId : parsedJson.Bit2Archetypes__Archetype__c.Bit2Archetypes__External_Id__c,
        archId : parsedJson.Bit2Archetypes__Archetype__c.Id,
        sequence
    });

    parsedJson['Bit2Archetypes__Archetype_Condition__c'].push(newConditionObj);
    parsedJson['Bit2Archetypes__Archetype_Column_Condition__c'].push(newColConditionObj);

    return parsedJson;
}

module.exports.addarchetypeactiontobundle = (opts) => {


    const {bundlejsonstr,actExtId,actionname,rtMapping} = opts;
    const parsedJson = JSON.parse(bundlejsonstr);

    //getting existing actions to calculate sequence
    let existingActions = parsedJson['Bit2Archetypes__Archetype_Column_Action__c'];
    let sequence = "0";
    if(existingActions.length!==0){
        existingActions = _.sortBy(existingActions,(act)=>{return act['Bit2Archetypes__Visualization_Sequence__c']});
        sequence = String(Number(existingActions.slice(-1).pop()['Bit2Archetypes__Visualization_Sequence__c']) + 1);
    }

    //cloning the current condition json and creating a boilerplate
    const newActionObj = this.generateActionJsonPlaceHolder({actExtId,
        actionname,
        rtId : rtMapping['Bit2Archetypes__Archetype_Action__c']
    });
    //updating and returning the json, add the column condition
    const newColActionObj = this.generateColActionJsonPlaceHolder({
        actExtId,
        columnActExtId : utility.generatebase16UUID(),
        archExtId : parsedJson.Bit2Archetypes__Archetype__c.Bit2Archetypes__External_Id__c,
        archId : parsedJson.Bit2Archetypes__Archetype__c.Id,
        sequence
    });

    parsedJson['Bit2Archetypes__Archetype_Action__c'].push(newActionObj);
    parsedJson['Bit2Archetypes__Archetype_Column_Action__c'].push(newColActionObj);

    return parsedJson;
}


module.exports.addarchetypeactionsteptobundle = (opts) => {
    const {bundlejsonstr,stepname,stepExtId,actionname,rtMapping,sequence} = opts;
    const parsedJson = JSON.parse(bundlejsonstr);

    //getting action externalId by name
    const requestedaction = parsedJson['Bit2Archetypes__Archetype_Action__c']
    .filter((act)=>{
        return act.Bit2Archetypes__Name__c === actionname;
    });

    if(requestedaction.length===0){
        throw new Error (`Cannot find an existing action with name ${actionname}`);
    }

    const newActionStepObj = this.generateActionStepJsonPlaceHolder({
        stepExtId,
        stepname,
        sequence,
        actExtId : requestedaction[0]['Bit2Archetypes__External_Id__c'],
        actId : requestedaction[0]['Id'],
        rtId : rtMapping['Bit2Archetypes__Archetype_Action_Step__c']
    });

    parsedJson['Bit2Archetypes__Archetype_Action_Step__c'].push(newActionStepObj);
    return parsedJson;

}


module.exports.associateactiontobundle = (opts) => {

    const {bundlejsonstr,actExtId,columnActExtId,rtMapping,sequence} = opts;
    const parsedJson = JSON.parse(bundlejsonstr);
    
    const newColumnAction = this.generateColActionJsonPlaceHolder({
        columnActExtId,
        archExtId,
        archExtId : parsedJson.Bit2Archetypes__Archetype__c.Bit2Archetypes__External_Id__c,
        archId : parsedJson.Bit2Archetypes__Archetype__c.Id,
        sequence
    });

    parsedJson['Bit2Archetypes__Archetype_Column_Action__c'].push(newColumnAction);
    return parsedJson;
}


module.exports.generateConditionJsonPlaceHolder = (opts) => {

    const {condExtId,conditionname,rtId} = opts;
    const conditionBP = {
        "Id": condExtId,
        "RecordTypeId" : rtId,
        "Bit2Archetypes__External_Id__c": condExtId,
        "Bit2Archetypes__Label__c": conditionname,
        "Bit2Archetypes__Name__c": `${conditionname}_${condExtId.slice(24)}`,
        "Bit2Archetypes__Path__c": "",
        "Bit2Archetypes__Type__c": "",
        "Bit2Archetypes__Template__c": this.generatePlaceHolderCondition(),
        "Bit2Archetypes__Variables__c": "",
        "Bit2Archetypes__Relationship__c": ""
    }
    return conditionBP;
}

module.exports.generateActionJsonPlaceHolder = (opts) => {
    const {actExtId,actionname,rtId} = opts;
    const actionBP = {
        "Id": actExtId,
        "RecordTypeId" : rtId,
        "Bit2Archetypes__External_Id__c": actExtId,
        "Bit2Archetypes__Label__c": actionname,
        "Bit2Archetypes__Name__c": `${actionname}_${actExtId.slice(24)}`,
        "Bit2Archetypes__Type__c": ""
    }
    return actionBP;
}

module.exports.generateColActionJsonPlaceHolder = (opts) => {
    
    const {columnActExtId,archExtId,actExtId,actId,archId,sequence} = opts;
    const colActionBP =  {
        "Id": columnActExtId,
        "Bit2Archetypes__Archetype__c": archId && archId!==archExtId ? archId : archExtId,
        "Bit2Archetypes__Archetype_Action__c": actId && actId!==actExtId ? actId : actExtId,
        "Bit2Archetypes__External_Id__c": columnActExtId,
        "Bit2Archetypes__Synchronization_Sequence__c": sequence || "0",
        "Bit2Archetypes__Visualization_Sequence__c": sequence || "0",
        "Bit2Archetypes__Object_Mapping__c": "",
        "Bit2Archetypes__Archetype__r": {
            "Bit2Archetypes__External_Id__c": archExtId
        },
        "Bit2Archetypes__Archetype_Action__r": {
            "Bit2Archetypes__External_Id__c": actExtId
        }
    }
    return colActionBP;
}

module.exports.generateColConditionJsonPlaceHolder = (opts) => {
    const {columnCondExtId,archExtId,condExtId,condId,archId,sequence} = opts;
    const colConditionBP = {
        "Id": columnCondExtId,
        "Bit2Archetypes__Archetype__c": archId && archId!==archExtId ? archId : archExtId,
        "Bit2Archetypes__Archetype_Condition__c": condId && condId!==condExtId ? condId : condExtId,
        "Bit2Archetypes__External_Id__c": columnCondExtId,
        "Bit2Archetypes__Synchronization_Sequence__c": sequence || "0",
        "Bit2Archetypes__Visualization_Sequence__c": sequence || "0",
        "Bit2Archetypes__Object_Mapping__c": "",
        "Bit2Archetypes__Archetype__r": {
            "Bit2Archetypes__External_Id__c": archExtId
        },
        "Bit2Archetypes__Archetype_Condition__r": {
            "Bit2Archetypes__External_Id__c": condExtId
        }
    }
    return colConditionBP;
}

module.exports.generateActionStepJsonPlaceHolder = (opts) => {

    const {stepExtId,rtId,actExtId,actId,stepname,sequence} = opts;
    const actionStepBP = {
        "Id": stepExtId,
        "RecordTypeId" : rtId,
        "Bit2Archetypes__Archetype_Action__c": actId && actId!==actExtId ? actId : actExtId,
        "Name": stepname,
        "Bit2Archetypes__Execution_sequence__c": sequence,
        "Bit2Archetypes__External_Id__c": stepExtId,
        "Bit2Archetypes__Operation__c": "modify",
        "Bit2Archetypes__Programs__c": "",
        "Bit2Archetypes__Action_Objs__c": "",
        "Bit2Archetypes__Template__c": this.generatePlaceHolderActionStep(),
        "Bit2Archetypes__Archetype_Action__r": {
            "Bit2Archetypes__External_Id__c": actExtId
        }
    };
    return actionStepBP;
}



