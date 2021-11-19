
import { flags, SfdxCommand } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core"
import * as create from '../../../b2wlib/utils/scripts/create';
import {getArchetypeB2wRecordTypeId} from '../../../helpers/queryhelper';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('b2warchetype', 'createcondition');

export default class CreateArchetypeCondition extends SfdxCommand{


    protected static requiresUsername = true;


    protected static flagsConfig = {
        debug : flags.boolean({
            char : 'd',
            description : messages.getMessage('debugFlagDescription'),
            required : false
        }),
        conditionname : flags.string(
            { 
                char : 'n' , 
                description : messages.getMessage('nameFlagDescription'),
                required : true
            }
        ),
        archetypename : flags.string(
            { 
                char : 'b' , 
                description : messages.getMessage('archetypeNameFlagDescription'),
                required : true
            }
        )
    }

    public async run(): Promise<any> {
        try{
            this.ux.startSpinner(`Creating archetype condition boilerplate on ${this.flags.archetypename}...`);
            const debugLevel = this.flags.debug ? 'debug' : 'error';
            const connection = this.org.getConnection();
            const recordtypes = await getArchetypeB2wRecordTypeId(connection);
            //querying salesforce data to grab recordtype references
            const opts = {
                archetypename : this.flags.archetypename,
                recordtypes : recordtypes,
                conditionname : this.flags.conditionname
            }
            await create.createarchetypecondition(debugLevel,opts);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }
    
}