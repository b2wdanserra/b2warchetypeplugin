import { getArchetypeB2wRecordTypeId } from "./queryhelper";
import {Connection} from '@salesforce/core';
import * as constants from '../b2wlib/constants';
import * as fs from 'fs';
import * as path from 'path';

const createRecordtypeMappingFile = async (connection : Connection) => {
    /*const recordtypes = await getArchetypeB2wRecordTypeId(connection);
    const filePath = path.join(constants.UTIL_DATA_BASE_FOLDER,'util_data','import','Recordtype.csv');
    const headerLine = 'Id,$$DeveloperName$NamespacePrefix$SobjectType'
    const lines = [headerLine];
    for(const rt of recordtypes){
        const extKeyStr = [rt.DeveloperName,rt.NamespacePrefix,rt.SobjectType].join(';');
        lines.push(`${rt.Id},${extKeyStr}`);
    }

    const ws = fs.createWriteStream(filePath);
    lines.forEach((line)=>{
        ws.write(`${line}\n`);
    })
    ws.end();*/
}

export {createRecordtypeMappingFile}