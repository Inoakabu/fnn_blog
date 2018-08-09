const uuid = require('uuid/v4')
const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);
const UUID = mongoose.Types.UUID;

const commentSchema = mongoose.Schema({
        id: { type: UUID, default: uuid.v4 },
        post_id: UUID,
        comment: String,
        user: String,
        createdOn: Date,
        lastUpdate: Date,
});

module.exports = mongoose.model('Comment', commentSchema);