var User = require('../model/user');

module.exports = function (app, passport){

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

    app.get('/cthulhu/allUsers',function(req,res){
        console.log('[!] all Users loaded');
        User.find({}, function(err, users){
            res.render('./admin/allUser.ejs', {users: users})
        })
    });

    app.post('/cthulhu/addUser',function(req,res){

    })

}