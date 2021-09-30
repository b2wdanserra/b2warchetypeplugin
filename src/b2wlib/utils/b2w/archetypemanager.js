
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



