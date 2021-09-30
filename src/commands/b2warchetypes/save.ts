import { SfdxCommand,flags } from "@salesforce/command";
import {Messages,SfdxError} from "@salesforce/core";
import * as save from "../../b2wlib/utils/scripts/save";


Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('b2warchetype', 'save');

export default class Save extends SfdxCommand{

    //setting up static properties for the command
    protected static requiresUsername = false;
    public static description = messages.getMessage('commandDescription');

    protected static flagsConfig = {
        name : flags.string({
            char : 'n',
            description : messages.getMessage('nameFlagDescription'),
            required : true
        }),
        debug : flags.boolean({
            char : 'd',
            description : messages.getMessage('debugFlagDescription'),
            required : false
        })
    }

    public async run(): Promise<any> {
        try{
            const archetypeName = this.flags.name;
            const debugLevel = this.flags.debug ? 'debug' : 'error';
            this.ux.startSpinner(`Saving Bit2Win Archetype with name ${archetypeName}`);
            const resultSave = save(archetypeName,debugLevel);
            this.ux.stopSpinner();
        }catch(ex){
            throw new SfdxError(`An error as occurred : ${ex}` )
        }
    }
    
}