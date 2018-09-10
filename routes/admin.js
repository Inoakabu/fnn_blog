var User = require('../model/user');

module.exports = function (app, passport){

    
    app.get('/cthulhu', isAdmin, (req,res) => {
        User.find({}, function(err, users){
            res.render('./admin/adminPanel.ejs', {users: users})
        })
    })

    app.get('/cthulhu/addUser',function(req,res){
        console.log('[!] User created');
        res.render('./admin/addUser.ejs')
    });
    
    app.get('/cthulhu/deleteUser',function(req,res){
        console.log('[!] User delete');
        User.findOneAndDelete({
            email: req.body.findUser
        },
        (err, result) => {
            if (err) return res.send(500,err)
            console.log('[!] Info: User deleted');
            res.redirect('/cthulhu');
        });
    });

    app.post('/cthulhu/addUser',function(req,res){

    })

}

// middleware to check if user is admin
function isAdmin(req,res,next) {
    if (req.user.isAdmin === true)
        return next();
    res.redirect('/profile');
}