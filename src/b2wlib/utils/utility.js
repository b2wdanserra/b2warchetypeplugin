const {serializeError} = require('serialize-error');
const { v4: uuidv4 } = require('uuid');
const UuidEncoder = require('uuid-encoder');

module.exports.printError = (err) => {
    return JSON.stringify(serializeError(err));
}

module.exports.generatebase16UUID = ()=>{
    const encoder = new UuidEncoder('base16');
    return `b2wvsc_${encoder.encode(uuidv4())}`;
}