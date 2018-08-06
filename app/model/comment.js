var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
        comment       : String,
        companyId     : String,
        linkid        : String,
        createdByUser : String,
        createdOn     : Date,
        lastUpdate    : Date,
});

module.exports = mongoose.model('Comment', commentSchema);