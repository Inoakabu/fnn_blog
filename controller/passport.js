var LocalStrategy   = require('passport-local').Strategy;

var User            = require('../model/user'); 

module.exports = function(passport){

    passport.serializeUser(function(user,done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id,done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });


    // Local Signup
    passport.use('local-signup', new LocalStrategy({

        usernameField       : 'email',
        passwordField       : 'password',
        passReqToCallback   : true
    },
    function(req, email, password, done) {

        process.nextTick(function(){

        User.findOne({ 'local.email' : email}, function(err, user) {
            if(err)
                return done(err);
            if(user) {
                console.log('E-mail allready taken')
                return done(null, false, { message : 'E-mail allready taken'});
            } else {
                console.log('hitting signup routin')
                var newUser = new User();
                
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.name = 'Name goes here';
                newUser.lastName = 'last name goes here';
                newUser.department = 'department goes here';
                newUser.companyId = 'companyId goes here';

                    newUser.save(function(err){
                        if(err)
                            throw err;

                        return done(null, newUser);
                    });
                };
            });
        })
    }));

    // local login
    passport.use('local-login', new LocalStrategy({
        
        usernameField       : 'email',
        passwordField       : 'password',
        passReqToCallback   : true
    },
    function(req, email, password, done) {
        
        User.findOne({ 'local.email' : email }, function(err,user){
            if(err)
                return done(err);

            if(!user){
                console.log('E-Mail not found.');
                return done(null, false, {message : 'E-Mail not found.' });
            }
            if(!user.validPassword(password)){
                console.log('Invalid Password.');
                return done(null, false, { message : 'Invalid Password.' });
            }
            return done(null, user);
        });
    }));
};