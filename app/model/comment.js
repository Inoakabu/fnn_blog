const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);
const UUID = mongoose.Types.UUID;

const commentSchema = mongoose.Schema({
        comment: String,
        id: { type: UUID, default: uuid.v4 },
        post_ID: UUID,
        user: String,
        createdOn: Date,
        lastUpdate: Date,
});

module.exports = mongoose.model('Comment', commentSchema);