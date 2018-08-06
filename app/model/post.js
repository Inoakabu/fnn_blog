var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
        blogposttitle           : String,
        blogpost                : String,
        uid                     : String,
        createdByUser           : String,
        createdOn               : Date,
        lastUpdate              : Date,
});

module.exports = mongoose.model('Post', postSchema);