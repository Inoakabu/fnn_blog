
const uuid = require('uuid/v4')
const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);
const UUID = mongoose.Types.UUID;

const postSchema = mongoose.Schema({
        id: { type: UUID, default: uuid.v4 },
        title: String,
        content: String,
        createdOn: { type: Date, default: new Date() },
        lastUpdate: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Post', postSchema);