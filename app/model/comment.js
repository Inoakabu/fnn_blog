const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);
var Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
        post_id: {type: Schema.ObjectId , ref: 'Post'},
        content: String,
        user: String,
        createdOn: Date,
        lastUpdate: Date,
});

module.exports = mongoose.model('Comment', commentSchema);