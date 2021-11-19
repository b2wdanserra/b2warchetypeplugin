
import { flags, SfdxCommand } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core"
import * as create from '../../../b2wlib/utils/scripts/create';
import {getArchetypeB2wRecordTypeId} from '../../../helpers/queryhelper';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('b2warchetype', 'createarchetype');

export default class CreateArchetype extends SfdxCommand{


    protected static requiresUsername = true;


    protected static flagsConfig = {
        debug : flags.boolean({
            char : 'd',
            description : messages.getMessage('debugFlagDescription'),
            required : false
        }),
        name : flags.string(
            { 
                char : 'n' , 
                description : messages.getMessage('nameFlagDescription'),
                required : true
            }
        ),
        conditionname : flags.string(
            { 
                char : 'c' , 
                description : messages.getMessage('conditionNameFlagDescription'),
                required : false
            }
        ),
        actionname : flags.string(
            { 
                char : 'a' , 
                description : messages.getMessage('actionNameFlagDescription'),
                required : false
            }
        )
    }

    public async run(): Promise<any> {
        try{
            this.ux.startSpinner(`Creating archetype boilerplate...`);
            const debugLevel = this.flags.debug ? 'debug' : 'error';
            const connection = this.org.getConnection();
            const recordtypes = await getArchetypeB2wRecordTypeId(connection);
            //querying salesforce data to grab recordtype references
            const opts = {
                archetypename : this.flags.name,
                recordtypes : recordtypes,
                agendagroup : 'agAlways',
                conditionname : this.flags.conditionname || 'condition',
                actionname : this.flags.actionname || 'action',
            }
            await create.createarchetype(debugLevel,opts);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }
    
}