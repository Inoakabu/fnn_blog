var express     = require('express');
var app         = express();
var passport    = require('passport');
var session     = require('express-session');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var MongoClient = require('mongodb').MongoClient

var port        = process.env.PORT || 3000;

var configDB    = require('./app/controller/database.js')

mongoose.connect(configDB.dbURL);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error DB'))

require('./app/controller/passport')(passport)
// var db;

// MongoClient.connect("mongodb://localhost:27017", (err,client)=>{
//     if (err) return console.log(err)
//     db = client.db('fnn_blog')
//     app.listen(3000,()=>{
//         console.log('Server listen on Port 3000')
//     })
// })


app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
// app.use(express.static('views'));
app.use(bodyParser.json());

app.use(session({ secret : 'secretscret' }));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes/user')(app, passport);
require('./app/routes/post')(app, db);

app.listen(port);
console.log('runs on ' + port);

// // post/comment routes - still trying to outsource
// app.get('/', (req, res) => {
//     db.collection('fnn_blog')
//     .aggregate([
//         { $lookup:
//             {
//                 from: 'fnn_blog_comment',
//                 localField: 'uid',
//                 foreignField: 'linkid',
//                 as: 'comments'
//             }
//         },
//         { $sort:
//             {
//                 _id: -1
//             }
//         }
//     ]).toArray(function(err,result){
//         if(err) return console.log(err)
//         console.log(JSON.stringify(result));
//         res.render('index.ejs', {fnn_blog: result})
//         db.close;
//     })
// });

// app.post('/addpost', (req,res) => {
//     var objectId = new ObjectID();
//     var originalHex = objectId.toHexString();
//     var newObjectId = new ObjectID.createFromHexString(originalHex);
//     var newHex = newObjectId.toHexString();
//     db.collection('fnn_blog')
//     .save({
//         blogposttitle: req.body.blogposttitle,
//         blogpost: req.body.blogpost,
//         uid: newHex
//     },(err,result)=>{
//         if (err) return console.log(err)

//         console.log('saved')
//         res.redirect('/')
//         db.close;
//     })
// });

// app.post('/addcomment', (req,res) => {
//     var objectId = new ObjectID();
//     var originalHex = objectId.toHexString();
//     var newObjectId = new ObjectID.createFromHexString(originalHex);
//     var newHex = newObjectId.toHexString();
//     db.collection('fnn_blog_comment')
//     .save({
//         comment: req.body.comment,
//         commentid: newHex,
//         linkid: req.body.uid
//     },(err,result)=>{
//         if (err) return console.log(err)

//         console.log('saved')
//         res.redirect('/')
//         db.close;
//     })
// });

// app.post('/updatePost', (req,res) => {
//     console.log(req.body)
//     db.collection('fnn_blog')
//     .findOneAndUpdate(
//         {
//             uid: req.body.findBlogPost //query, lookup
//         },{
//         $set: {
//             blogposttitle: req.body.replaceBlogPostTitle,
//             blogpost: req.body.replaceBlogPost
//         } // update statement
//         }, 
//         (err, result) => {
//             if (err) return res.send(err)
//             console.log('updated');
//             res.redirect('/');
//             db.close;
//     })
// })

// app.post('/updateComment', (req,res) => {
//     console.log(req.body)
//     db.collection('fnn_blog_comment')
//     .findOneAndUpdate(
//         {
//             commentid: req.body.findComment //query, lookup
//         },{
//         $set: {
//             comment: req.body.replaceComment
//         } // update statement
//         }, 
//         (err, result) => {
//             if (err) return res.send(err)
//             res.redirect('/')
//             db.close;
//     })
//     console.log('updated')
// })

// app.post('/deletePost/:id', (req,res) => {
//     db.collection('fnn_blog')
//     .findOneAndDelete({ uid: req.params.id },
//         (err,result) => {
//             if (err) return res.send(500, err)
//             console.log('deleted:', req.params.id)
//         }
//     )
//     db.collection('fnn_blog_comment')
//     .remove(
//         {
//             linkid: req.params.id
//         },
//         (err,result) => {
//             if (err) return res.send(500, err)
//             res.redirect('/')
//             db.close;
//         }
//     )
// })

// // call if comment have to be deletet AND the Post itself
// app.post('/deleteComment/:id', (req,res) => {
//     db.collection('fnn_blog_comment')
//     .findOneAndDelete(
//         { 
//             commentid: req.params.id 
//         },
//         (err,result) => {
//             if (err) return res.send(500, err)
//             console.log('deleted:', req.params.id)
//             res.redirect('/')
//             db.close;
//         }
//     )
// })