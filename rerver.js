const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config/config.json'),
    ObjectID = require('mongodb').ObjectID,
    STATUSCODE = require('./app/helper/StatusCodes').statuses,
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
        .toArray((err, result) => {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            // console.log(result)               
            res.status(STATUSCODE.OK).json(result)
            db.close;
        })
});


/**
 * /Post CRUDS
 */
const post = require('./app/routes/post')(db)
app.route('/post')
    .all()
    .post(post.create)
    .delete(post.delete)
    .put(post.update)
/**
 * /Comment CRUDS
*/
const comment = require('./app/routes/comment')(db)
app.route('/comment')
    .all()
    .post(comment.create)
    .delete(comment.delete)
    .put(comment.update)