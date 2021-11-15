module.exports.extractVariablesFromConditionsMapping = (conditionCode) => {
    let variables = "";
    //splitting condition code lines by semicolon
    const conditionLines = conditionCode.split(";");
    //getting variables
    for(const cond of conditionLines){
        if(cond && cond!==''){
            let fullCond = cond.split(":")[1].trim();
            let defineObj = fullCond.includes('(') ? fullCond.substring(0,fullCond.indexOf('(')).trim() : fullCond;
            let variableMarker = cond.split(":")[0].trim();
            let variableName = variableMarker.substring(variableMarker.indexOf("{%")+2,variableMarker.lastIndexOf("%}"));
            variables+=`${variableName}:${defineObj}:${variableName};`;
        }
    }
    return variables;
}

module.exports.extractVariablesFromConditions = (conditionCode) => {
    let variables = "";
    //splitting condition code lines by semicolon
    const conditionLines = conditionCode.split(";");
    //getting variables
    for(const cond of conditionLines){
        if(cond && cond!==''){
            let fullCond = cond.split(":")[1].trim();
            let defineObj = fullCond.includes('(') ? fullCond.substring(0,fullCond.indexOf('(')).trim() : fullCond;
            let variableMarker = cond.split(":")[0].trim();
            let variableName = variableMarker.substring(variableMarker.indexOf("{%")+2,variableMarker.lastIndexOf("%}"));
            variables+=`${variableName}:${defineObj};`;
        }
    }
    return variables;
}

module.exports.generatePlaceHolderActionStep = () => {
    return `/*this a boilerplate action step, plase modify step and condition accordingly to your needs*/\nmodify({%con%}, function(){\n\tconsole.log('test');\n});`;
}
module.exports.generatePlaceHolderCondition = ()=>{
    return `{%con%} : contextdata;\n`
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
            {
                "Id": columnCondExtId,
                "Bit2Archetypes__Archetype__c": archExtId,
                "Bit2Archetypes__Archetype_Condition__c": condExtId,
                "Bit2Archetypes__External_Id__c": columnCondExtId,
                "Bit2Archetypes__Synchronization_Sequence__c": "0",
                "Bit2Archetypes__Visualization_Sequence__c": "0",
                "Bit2Archetypes__Object_Mapping__c": "con:contextdata:con;",
                "Bit2Archetypes__Archetype__r": {
                    "Bit2Archetypes__External_Id__c": archExtId
                },
                "Bit2Archetypes__Archetype_Condition__r": {
                    "Bit2Archetypes__External_Id__c": condExtId
                }
            }
        ],
        "Bit2Archetypes__Archetype_Column_Action__c": [
            {
                "Id": columnActExtId,
                "Bit2Archetypes__Archetype__c": archExtId,
                "Bit2Archetypes__Archetype_Action__c": actExtId,
                "Bit2Archetypes__External_Id__c": columnActExtId,
                "Bit2Archetypes__Synchronization_Sequence__c": "0",
                "Bit2Archetypes__Visualization_Sequence__c": "0",
                "Bit2Archetypes__Object_Mapping__c": "con:contextdata:con;",
                "Bit2Archetypes__Archetype__r": {
                    "Bit2Archetypes__External_Id__c": archExtId
                },
                "Bit2Archetypes__Archetype_Action__r": {
                    "Bit2Archetypes__External_Id__c": actExtId
                }
            }
        ],
        "Bit2Archetypes__Archetype_Action__c": [
            {
                "Id": actExtId,
                "RecordTypeId" : recordtypes['Bit2Archetypes__Archetype_Action__c'],
                "Bit2Archetypes__External_Id__c": actExtId,
                "Bit2Archetypes__Label__c": actionname,
                "Bit2Archetypes__Name__c": actionname,
                "Bit2Archetypes__Type__c": ""
            }
        ],
        "Bit2Archetypes__Archetype_Condition__c": [
            {
                "Id": condExtId,
                "RecordTypeId" : recordtypes['Bit2Archetypes__Archetype_Condition__c'],
                "Bit2Archetypes__External_Id__c": condExtId,
                "Bit2Archetypes__Label__c": conditionname,
                "Bit2Archetypes__Name__c": conditionname,
                "Bit2Archetypes__Path__c": "",
                "Bit2Archetypes__Type__c": "",
                "Bit2Archetypes__Template__c": this.generatePlaceHolderCondition(),
                "Bit2Archetypes__Variables__c": "con:contextdata;",
                "Bit2Archetypes__Relationship__c": ""
            }
        ],
        "Bit2Archetypes__Archetype_Action_Parameter__c": [],
        "Bit2Archetypes__Archetype_Condition_Parameter__c": [],
        "Bit2Archetypes__Archetype_Action_Step__c": [
            {
                "Id": stepExtId,
                "RecordTypeId" : recordtypes['Bit2Archetypes__Archetype_Action_Step__c'],
                "Bit2Archetypes__Archetype_Action__c": actExtId,
                "Name": stepname,
                "Bit2Archetypes__Execution_sequence__c": "1",
                "Bit2Archetypes__External_Id__c": stepExtId,
                "Bit2Archetypes__Operation__c": "modify",
                "Bit2Archetypes__Programs__c": "",
                "Bit2Archetypes__Action_Objs__c": "con:contextdata;",
                "Bit2Archetypes__Template__c": this.generatePlaceHolderActionStep(),
                "Bit2Archetypes__Archetype_Action__r": {
                    "Bit2Archetypes__External_Id__c": actExtId
                }
            }
        ]
    }
}


