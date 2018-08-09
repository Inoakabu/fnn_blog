var mongoose = require('mongoose')
require('mongoose-uuid2')(mongoose);
const UUID = mongoose.Types.UUID;

var userSchema = mongoose.Schema({
    id: { type: UUID, default: uuid.v4 },
    local: {
        email: String,
        password: String,
    },
    name: String,
    lastName: String,
    department: String
});


module.exports = mongoose.model('User', userSchema);