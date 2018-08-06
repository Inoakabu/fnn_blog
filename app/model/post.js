var mongoose = require('mongoose');
var ObjectID    = require('mongodb').ObjectID

var postSchema = mongoose.Schema({
        blogposttitle           : String,
        blogpost                : String,
        uid                     : String,
        createdByUser           : String,
        createdOn               : Date,
        lastUpdate              : Date,
});

postSchema.methods.generateUID = function(){
        var objectId = new ObjectID();
        var originalHex = objectId.toHexString();
        var newObjectId = new ObjectID.createFromHexString(originalHex);
        var newHex = newObjectId.toHexString();
        return newHex;
}

module.exports = mongoose.model('Post', postSchema);