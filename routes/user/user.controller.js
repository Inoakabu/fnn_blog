const User = require('../../schema/user.schema');
const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID

const { Config } = require('../../models');
const { HTTP_STATUS } = require('../../utils');

const dbConf = new Config().db;

module.exports = function (app, db, passport) {

    app.get('/login', function (req, res) {
        console.log('[!] Login check')
        res.render('./user/login.ejs', { message: req.message });
    });

    app.get('/signup', function (req, res) {
        console.log('[!] Signup check')
        res.render('./user/signup.ejs');
    });

    app.get('/profile', isLoggedIn, function (req, res) {

        res.render('./user/profile.ejs', {
            user: req.user //get User from session
        });
    });

    app.get('/profile/editProfile/:id', isLoggedIn, function (req, res) {
        res.render('./user/editProfile.ejs', {
            user: req.user
        });
    });

    app.get('/renewPassword/:id', isLoggedIn, function (req, res) {
        res.render('renewPassword.ejs', {
            user: req.user
        })
    });

    app.get('/renewPassword/:id/:token', isLoggedIn, function (req, res) {
        User.findOne({
            _id: req.params.id
            , resetPasswordToken: req.params.token
            , resetPasswordExpires: { $gt: Date.now() }
        }, function (err, user) {
            //console.log(user);
            if (!user) {
                console.log('[!] error - No reset token found or expired');
                return res.redirect('/profile');
            } else {
                res.render('./user/renewPassword.ejs', {
                    user: req.user
                });
            }
        })
    })

    app.get('/logout', function (req, res) {
        console.log('[!] User logged out')
        req.logOut();
        req.session.destroy();
        res.redirect('/');
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/',
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage: true
    }))

    app.post('/profile/editProfile/:id', isLoggedIn, function (req, res) {
        return User.findById(req.params.id, function (err, user) {
            user.name = req.body.nameEdit;
            user.lastName = req.body.lastNameEdit;
            user.department = req.body.departmentEdit;
            user.companyId = req.body.companyIdEdit;

            return user.save(function (err) {
                if (!err) {
                    console.log("Updated");
                } else {
                    console.log(err)
                }
                return res.redirect('/profile')
            })
        })
    });

    app.post('/renewPassword/:id', isLoggedIn, function (req, res) {
        // TODO:
        // 0. only already logged in users can change PW by them self
        // 0.1. if user forgot PW "forgot password" will send a mail
        // to an admin or so
        // 1. set ResetToken + expire
        // 1.2. check old Password before do any changes
        // 2. confirm new Password
        // 2.1. bcrypt hash new password ON save

        return User.findById(req.params.id, function (err, user) {

            user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordExpires = Date.now() + 360000;

            let redirectURL = '/renewPassword/' + req.params.id + '/' + user.resetPasswordToken
            return user.save(function (err) {
                if (!err) {
                    console.log("[!] Token set" + user.resetPasswordToken);
                    return res.redirect(redirectURL)
                } else {
                    console.log(err)
                }
            })
        })
    });

    app.post('/renewPassword/:id/:token', isLoggedIn, function (req, res) {
        User.findOne(
            {
                _id: req.params.id
                , resetPasswordToken: req.params.token
                , resetPasswordExpires: { $gt: Date.now() }
            }, function (err, user) {

                let redirectURL = '/renewPassword/' + req.params.id + '/' + req.params.token
                let password = req.body.oldPassword;
                let newPassword = req.body.newPassword;
                if (!user.validPassword(password)) {
                    console.log('[!] old password not matching');
                    res.redirect(redirectURL);
                } else if (req.body.newPassword != req.body.confirmNewPassword) {
                    console.log('[!] new password not confirmed');
                    res.redirect(redirectURL);
                } else {
                    user.local.password = user.generateHash(newPassword);

                    user.save(function (err) {
                        if (!err) {
                            console.log("[!] password changed");
                        } else {
                            console.log(err)
                        }
                        return res.redirect('/profile');
                    })
                }
            })
    })
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};