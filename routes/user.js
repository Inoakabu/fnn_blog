var User = require('../model/user');

module.exports = function(app, passport){

    app.get('/login',function(req,res){
        console.log('login check')
        res.render('./user/login.ejs', { message : req.message });
    });

    app.get('/signup',function(req,res){
        console.log('signup check')
        res.render('./user/signup.ejs');
    });

    app.get('/profile', isLoggedIn, function(req,res){
        res.render('./user/profile.ejs',{
            user : req.user //get User from session
        });
    });

    app.get('/profile/editProfile/:id', isLoggedIn, function(req,res){
        res.render('./user/editProfile.ejs',{
            user : req.user
        });
    });

    app.get('/logout', function(req,res){
        req.logout();
        res.redirect('/');
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/',
    }));

    app.post('/login', passport.authenticate('local-login',{
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureMessage : true
    }))

    app.post('/profile/editProfile/:id', isLoggedIn, function(req,res){
        return User.findById(req.params.id, function(err, user){
            user.name = req.body.nameEdit;
            user.lastName = req.body.lastNameEdit;
            user.department = req.body.departmentEdit;
            user.companyId = req.body.companyIdEdit;
 
            return user.save(function(err){
                if (!err){
                    console.log("Updated");
                }else{
                    console.log(err)
                }
                return res.redirect('/profile')
            })
        })
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};