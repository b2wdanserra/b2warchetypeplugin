import {Connection} from '@salesforce/core';

const ARCHETYPE_RECORDTYPE_QUERY = "SELECT Id,SobjectType FROM RecordType WHERE SobjectType IN ('Bit2Archetypes__Archetype__c','Bit2Archetypes__Archetype_Condition__c','Bit2Archetypes__Archetype_Action__c','Bit2Archetypes__Archetype_Action_Step__c') AND DeveloperName = 'B2Wgin'";

const getArchetypeB2wRecordTypeId = async (connection : Connection): Promise<any> => {
    let result = await connection.query(ARCHETYPE_RECORDTYPE_QUERY);
    let {records} = result;
    return records;
    
}



export {getArchetypeB2wRecordTypeId};