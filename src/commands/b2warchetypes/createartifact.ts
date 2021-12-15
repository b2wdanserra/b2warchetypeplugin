import { flags, SfdxCommand } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core"
import * as createartifacts from "../../b2wlib/utils/scripts/createartifacts";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('b2warchetype', 'createartifact');

export default class CreateArtifact extends SfdxCommand{

    //setting up static properties for the command
    protected static requiresUsername = true;
    public static description = messages.getMessage('commandDescription');


    protected static flagsConfig = {
        debug : flags.boolean({
            char : 'd',
            description : messages.getMessage('debugFlagDescription'),
            required : false
        }),
        timestamp : flags.boolean({
            char : 't',
            description : messages.getMessage('timestampFlagDescription'),
            required : false
        })
    }


    public async run(): Promise<any> {
        try{
            const debugLevel = this.flags.debug ? 'debug' : 'error';
            const timestamp = this.flags.timestamp;
            const orgAlias = this.flags.targetusername;

            this.ux.startSpinner(`Creating artifact from Bit2Win Archetypes files`);
            await createartifacts(debugLevel,timestamp,orgAlias);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }
}