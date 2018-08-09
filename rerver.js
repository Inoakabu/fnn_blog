const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config/config.json'),
    ObjectID = require('mongodb').ObjectID,
    STATUSCODE = require('./helper/StatusCodes').statuses,
    session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secretscret',
    saveUninitialized: false,
    resave: false
}));

mongoose.connect(`mongodb://${config.db.ip}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("[!] First start the DB.")
        process.exit();
        return
    } else {
        console.log(`[*] Connected to MongoDB`)
        app.listen(config.express.port, () => {
            console.log(`[*] Express runs on localhost:${config.express.port}`)
        })
    }
});

const db = mongoose.connection;
// db.dropDatabase(); // clear DB!

app.get('/', (req, res) => {
    db.collection(config.db.collections.posts)
        .aggregate([{
            $lookup: {
                from: config.db.collections.comments,
                localField: 'post_id',
                foreignField: 'post_id',
                as: 'comments'
            }
        }, {
            $sort: { _id: -1 }
        }])
        .toArray(function (err, result) {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            // console.log(result)               
            res.status(STATUSCODE.OK).json(result)
            db.close;
        })
});

app.route('/post')
    .post((req, res) => {
        const oHex = new ObjectID().toHexString();
        const nHex = new ObjectID.createFromHexString(oHex).toHexString();
        db.collection(config.db.collections.posts)
            .save({
                id: nHex,
                title: req.body.post_title,
                content: req.body.post_content
            }, (err, result) => {
                if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                // console.log(result)               
                console.log('[*] Info: Post saved', result.ops[0].id)
                res.status(STATUSCODE.CREATED).json(result.ops[0])
                db.close;
            })
    })
    .delete((req, res) => {
        db.collection(config.db.collections.posts)
            .findOneAndDelete({ post_id: req.body.post_id },
                (err, result) => {
                    if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                    // console.log(result)               
                    console.log('[*] Info: Post deleted:', req.body.post_id)
                })
        db.collection(config.db.collections.comments)
            .remove({ post_id: req.body.post_id },
                (err, result) => {
                    if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                    // console.log(result)               
                    console.log('[*] Info: Comments from Post deleted:', req.body.post_id)
                    res.status(STATUSCODE.OK).end()
                    db.close;
                })
    })
    .put((req, res) => {
        db.collection(config.db.collections.posts)
            .findOneAndUpdate({ id: req.body.post_id }, {
                $set: {
                    title: req.body.post_title,
                    content: req.body.post_content
                }
            }, (err, result) => {
                if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                // console.log(result)
                console.log('[*] Info: Post Updated:', result.value.id)
                res.status(STATUSCODE.OK).json(result.value);
                db.close;
            })
    });

app.route('/comment')
    .post((req, res) => {
        const oHex = new ObjectID().toHexString();
        const nHex = new ObjectID.createFromHexString(oHex).toHexString();
        db.collection(config.db.collections.comments)
            .save({
                id: nHex,
                content: req.body.comment_content,
                post_id: req.body.post_id
            }, (err, result) => {
                if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                // console.log(result)               
                console.log('[*] Info: Comment added to', result.ops[0].post_id, result.ops[0].id)
                res.status(STATUSCODE.CREATED).json(result.ops[0])
                db.close;
            })
    })
    .delete((req, res) => {
        db.collection(config.db.collections.comments)
            .findOneAndDelete({ id: req.body.comment_id },
                (err, result) => {
                    if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                    // console.log(result)
                    console.log('[*] Info: Comment deleted:', result.value.id)
                    res.status(STATUSCODE.OK).end()
                    db.close;
                }
            )
    })
    .put((req, res) => {
        db.collection(config.db.collections.comments)
            .findOneAndUpdate({ id: req.body.comment_id }, {
                $set: {
                    content: req.body.comment_content
                }
            }, (err, result) => {
                if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                // console.log(result)            
                console.log('[*] Info: Comment Updated:', result.value.id)
                res.status(STATUSCODE.OK).json(result.value);
                db.close;
            })
    });