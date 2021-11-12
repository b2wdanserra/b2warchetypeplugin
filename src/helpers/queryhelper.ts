import {Connection} from '@salesforce/core';

const ARCHETYPE_RECORDTYPE_QUERY = "SELECT Id FROM RecordType WHERE SobjectType = 'Bit2Archetypes__Archetype__c' AND DeveloperName = 'B2Wgin' LIMIT 1";

const getArchetypeB2wRecordTypeId = async (connection : Connection): Promise<any> => {
    let result = await connection.query(ARCHETYPE_RECORDTYPE_QUERY);
    return result.records[0];
}

export {getArchetypeB2wRecordTypeId};