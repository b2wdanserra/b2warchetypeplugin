import { flags, SfdxCommand } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core"
import * as extract from "../../b2wlib/utils/scripts/extract";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('b2warchetype', 'exportall');


export default class ExportAll extends SfdxCommand{

    //setting up static properties for the command
    protected static requiresUsername = false;
    public static description = messages.getMessage('commandDescription');


    protected static flagsConfig = {
        orgalias : flags.string(
            { 
                char : 'a' , 
                description : messages.getMessage('orgAliasFlagDescription'),
                required : true
            }
        ),
        debug : flags.boolean({
            char : 'd',
            description : messages.getMessage('debugFlagDescription'),
            required : false
        })
    }


    public async run(): Promise<any> {
        try{
            const orgAlias = this.flags.orgalias;
            const debugLevel = this.flags.debug ? 'debug' : 'error';
            this.ux.startSpinner(`Extracting Bit2Win Archetypes from ${orgAlias}`);
            await extract(orgAlias,debugLevel);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }

}