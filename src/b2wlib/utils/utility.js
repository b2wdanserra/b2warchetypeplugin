const {serializeError} = require('serialize-error');

module.exports.printError = (err) => {
    return JSON.stringify(serializeError(err));
}
