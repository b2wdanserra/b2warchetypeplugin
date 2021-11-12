
import { flags, SfdxCommand } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core"
import * as create from '../../../b2wlib/utils/scripts/create';


export default class CreateArchetype extends SfdxCommand{


    public async run(): Promise<any> {
        try{
            const debugLevel = 'debug';
            this.ux.startSpinner(`Creating archetype boilerplate...`);
            await create.createarchetype(debugLevel);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }
    
}