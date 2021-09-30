const sfdx = require('sfdx-node');

module.exports.checkAlias = async (alias)=>{
    const aliases = await sfdx.alias.list();
    const mappedAlias = aliases.map((e)=>{return e.alias});
    if(!mappedAlias.includes(alias)){
        throw new Error('Please Use an SFDX available alias : ' + JSON.stringify(aliases));
    }
}