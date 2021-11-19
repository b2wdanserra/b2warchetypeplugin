import { flags, SfdxCommand } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core"
import * as deploy from "../../b2wlib/utils/scripts/deploy";
import * as extract from '../../b2wlib/utils/scripts/extract';
// import {createRecordtypeMappingFile} from '../../helpers/recordtypefilehelper';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('b2warchetype', 'deploy');

export default class Deploy extends SfdxCommand{

    //setting up static properties for the command
    protected static requiresUsername = true;
    public static description = messages.getMessage('commandDescription');


    protected static flagsConfig = {
        debug : flags.boolean({
            char : 'd',
            description : messages.getMessage('debugFlagDescription'),
            required : false
        })
    }


    public async run(): Promise<any> {
        try{
            const orgAlias = this.flags.targetusername;
            const debugLevel = this.flags.debug ? 'debug' : 'error';
            this.ux.startSpinner(`Deploying Bit2Win Archetypes to ${orgAlias}`);
            //const connection = this.org.getConnection();
            //await createRecordtypeMappingFile(connection);
            await extract(orgAlias,debugLevel);
            await deploy(orgAlias,debugLevel);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }
}