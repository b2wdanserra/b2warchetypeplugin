
import { flags, SfdxCommand } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core"
import * as associate from '../../../b2wlib/utils/scripts/associate';
import {getArchetypeB2wRecordTypeId} from '../../../helpers/queryhelper';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('b2warchetype', 'associateaction');

export default class AssociateArchetypeAction extends SfdxCommand{


    protected static requiresUsername = true;


    protected static flagsConfig = {
        debug : flags.boolean({
            char : 'd',
            description : messages.getMessage('debugFlagDescription'),
            required : false
        }),
        actExtId : flags.string(
            { 
                char : 'n' , 
                description : messages.getMessage('actExtIfFlagDescription'),
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
            this.ux.startSpinner(`associating archetype action with extId ${this.flags.actExtId}  on ${this.flags.archetypename}...`);
            const debugLevel = this.flags.debug ? 'debug' : 'error';
            const connection = this.org.getConnection();
            const recordtypes = await getArchetypeB2wRecordTypeId(connection);
            //querying salesforce data to grab recordtype references
            const opts = {
                archetypename : this.flags.archetypename,
                recordtypes : recordtypes,
                actExtId : this.flags.actExtId
            }
            await associate.associateAction(debugLevel,opts);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }
    
}