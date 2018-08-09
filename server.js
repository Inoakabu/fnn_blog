const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./app/config/config.json');

/**
 * BodyParser
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Mongo DB connection
 */
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


/**
 * / CRUDS
 */
const auth = require('./app/routes/auth')
const main = require('./app/routes/main')
app.route('/')
    .get(main.all);


/**
 * /Post CRUDS
 */
const post = require('./app/routes/post')
app.route('/post')
    .get(post.get)
    .all((req, res, next) => auth(req, res, next, db))
    .post(post.create)
    .delete(post.delete)
    .put(post.update)

/**
 * /Comment CRUDS
*/
const comment = require('./app/routes/comment')
app.route('/comment')
    .get(comment.get)
    .all((req, res, next) => auth(req, res, next, db))
    .post(comment.create)
    .delete(comment.delete)
    .put(comment.update)