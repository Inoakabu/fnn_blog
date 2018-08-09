const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);
const UUID = mongoose.Types.UUID;

const postSchema = mongoose.Schema({
        id: { type: UUID, default: uuid.v4 },
        title: String,
        content: String,
        user: String,
        createdOn: Date,
        lastUpdate: Date,
});

module.exports = mongoose.model('Post', postSchema);