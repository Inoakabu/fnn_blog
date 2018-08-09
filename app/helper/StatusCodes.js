const phraseCode = {};

require('./StatusCodes.json').forEach(code => {
    let phrase = code.phrase.toUpperCase().replace(/[^A-Z]/g, '_');
    phraseCode[phrase] = Number(code.code);
});

exports.statuses = phraseCode

