const phraseCode = {};

require('./HTTP_Status.json').forEach(code => {
    let phrase = code.phrase.toUpperCase().replace(/[^A-Z]/g, '_');
    phraseCode[phrase] = Number(code.code);
});

exports.codes = phraseCode

