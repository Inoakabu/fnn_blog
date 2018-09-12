var User = require('../model/user');
const ObjectID      = require('mongodb').ObjectID


module.exports = function (app, passport){
        
    app.get('/cthulhu', isAdmin, (req,res) => {
        User.find({}, function(err, user){
            if(err) return console.log(err);
            // console.log(user);
            res.render('./admin/adminPanel.ejs', {user: user})
        })
    });

    app.get('/cthulhu/editUser/:id', function(req,res){
        res.render('editUser.ejs');
    });

    app.post('/cthulhu/addUser',function(req,res){

        var objectId        = new ObjectID();
        var originalHex     = objectId.toHexString();
        var newObjectId     = new ObjectID.createFromHexString(originalHex);
        var newHex          = newObjectId.toHexString();

        // process.nextTick(function(){
            User.findOne({email : req.body.email}, function(err,user){
                if(err)
                    console.log(err);
                if(user) {
                    console.log('[!] E-mail allready taken')
                    res.redirect('/cthulhu');
                } else {
                    console.log('[!] hitting signup routin')
                    var newUser = new User();
                    
                    newUser.uid             = newHex;
                    newUser.local.email     = req.body.email;
                    newUser.local.password  = newUser.generateHash(req.body.password);
                    newUser.name            = '';
                    newUser.lastName        = '';
                    newUser.nickname        = '';
                    newUser.role            = 'user';
                    newUser.status          = 'inactive';

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        console.log('[!] Info: User saved')
                        res.redirect('/cthulhu')
                        return newUser;
                    });
                };
            });
        // });
    });

    app.post('/cthulhu/editUser/:id', function(req,res){

        User.findById(req.params.id, function(err,user){
            user.role       = req.body.roleEdit;
            user.status     = req.body.statusEdit;
            user.isAdmin    = req.body.isAdminEdit;

            user.save(function(err){
                if(!err){
                    console.log('[!] Info: User updated');
                }else{
                    console.log(err)
                }
                res.redirect('/cthulhu')
            })
        });

    });

    app.post('/cthulhu/deleteUser/:id',function(req,res){
        console.log('[!] User delete');
        User.findOneAndDelete({
            uid: req.params.id
        },
        (err, result) => {
            if (err) return res.send(500,err)
            console.log('[!] Info: User deleted');
            res.redirect('/cthulhu');
        });
    });

}

// middleware to check if user is admin
function isAdmin(req,res,next) {
    if (req.user.isAdmin === true)
        return next();
    res.redirect('/profile');
}