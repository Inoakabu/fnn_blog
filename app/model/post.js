
const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);
var Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
        title: String,
        content: String,
        createdOn: { type: Date, default: new Date() },
        lastUpdate: { type: Date, default: new Date() },
        comments: [{ type: Schema.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', postSchema);