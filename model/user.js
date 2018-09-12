var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
        uid          : String,
        role         : { type: String, enum: ['admin','streamer','user','toximoron'], default: 'user'},
        isAdmin      : { type: Boolean, default: false},
        status       : { type: String, enum: ['active','inactive','delete'], default: 'inactive'},
        name         : String,
        lastName     : String,
        nickname     : String,
        resetPasswordToken      : String,
        resetPasswordExpires    : Date,
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);