const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/config.json');
const ObjectID = require('mongodb').ObjectID
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const dbURL = require('./config/dbURL').dbURL

/**
 * MongoDb Connection
 */
mongoose.connect(`mongodb://${config.db.ip}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("[!] First start the DB. " +err)
        process.exit();
        return
    } else {
        console.log(`[*] Connected to MongoDB`)
        app.listen(config.express.port, () => {
            console.log(`[*] Express runs on localhost:${config.express.port}`)
        })
    }
});
// Connection to MongoDB
const db = mongoose.connection;
// db.dropDatabase(); // clear DB!

require('./controller/passport')(passport)

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(express.static('views'));
app.use(bodyParser.json());

app.use(session({
    secret: 'secretscret',
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/user')(app, passport);

app.get('/', (req, res) => {
    db.collection('fnn_blog')
        .aggregate([
            {
                $lookup:
                {
                    from: 'fnn_blog_comment',
                    localField: 'uid',
                    foreignField: 'linkid',
                    as: 'comments'
                }
            },
            {
                $sort:
                {
                    _id: -1
                }
            }
        ]).toArray(function (err, result) {
            if (err) return console.log(err)
            // console.log(JSON.stringify(result));
            res.render('index.ejs', { fnn_blog: result, isLoggedIn: req.isAuthenticated() })
            db.close;
        })
});

app.post('/addpost', isLoggedIn, (req, res) => {
    var objectId = new ObjectID();
    var originalHex = objectId.toHexString();
    var newObjectId = new ObjectID.createFromHexString(originalHex);
    var newHex = newObjectId.toHexString();
    db.collection('fnn_blog')
        .save({
            blogposttitle: req.body.blogposttitle,
            blogpost: req.body.blogpost,
            uid: newHex
        }, (err, result) => {
            if (err) return console.log(err)
            console.log('[*] Info: Post saved')
            res.redirect('/')
            db.close;
        })
});

app.post('/addcomment', isLoggedIn, (req, res) => {
    var objectId = new ObjectID();
    var originalHex = objectId.toHexString();
    var newObjectId = new ObjectID.createFromHexString(originalHex);
    var newHex = newObjectId.toHexString();
    db.collection('fnn_blog_comment')
        .save({
            comment: req.body.comment,
            commentid: newHex,
            linkid: req.body.uid
        }, (err, result) => {
            if (err) return console.log(err)

            console.log('[*] Info: Comment saved')
            res.redirect('/')
            db.close;
        })
});

app.post('/updatePost', isLoggedIn, (req, res) => {
    console.log(req.body)
    db.collection('fnn_blog')
        .findOneAndUpdate(
            {
                uid: req.body.findBlogPost //query, lookup
            }, {
                $set: {
                    blogposttitle: req.body.replaceBlogPostTitle,
                    blogpost: req.body.replaceBlogPost
                } // update statement
            },
            (err, result) => {
                if (err) return res.send(err)
                console.log('[*] Info: Post updated');
                res.redirect('/');
                db.close;
            })
})

app.post('/updateComment', isLoggedIn, (req, res) => {
    console.log(req.body)
    db.collection('fnn_blog_comment')
        .findOneAndUpdate(
            {
                commentid: req.body.findComment //query, lookup
            }, {
                $set: {
                    comment: req.body.replaceComment
                } // update statement
            },
            (err, result) => {
                if (err) return res.send(err)
                console.log('[*] Info: Comment updated');
                res.redirect('/')
                db.close;
            })
    console.log('updated')
})

app.post('/deletePost/:id', isLoggedIn, (req, res) => {
    db.collection('fnn_blog')
        .findOneAndDelete({ uid: req.params.id },
            (err, result) => {
                if (err) return res.send(500, err)
                console.log('[*] Info: Post deleted:', req.params.id)
            }
        )
    db.collection('fnn_blog_comment')
        .remove(
            {
                linkid: req.params.id
            },
            (err, result) => {
                if (err) return res.send(500, err)
                res.redirect('/')
                db.close;
            }
        )
})

// call if comment have to be deleted AND the Post itself
app.post('/deleteComment/:id', isLoggedIn, (req, res) => {
    db.collection('fnn_blog_comment')
        .findOneAndDelete(
            {
                commentid: req.params.id
            },
            (err, result) => {
                if (err) return res.send(500, err)
                console.log('[*] Info: Comments in deleted Post deleted:', req.params.id)
                res.redirect('/')
                db.close;
            }
        )
})

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    console.log('You are not authenticated, please login')
    res.redirect('/');
};