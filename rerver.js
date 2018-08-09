const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./app/config/config.json'),
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


/**
 * / CRUDS
 */
const main = require('./app/routes/main')
app.route('/')
    .get((req, res) => main.all(req, res, db));


/**
 * /Post CRUDS
 */
const post = require('./app/routes/post')
app.route('/post')
    .all()
    .get((req, res) => post.get(req, res, db))
    .post((req, res) => post.create(req, res, db))
    .delete((req, res) => post.delete(req, res, db))
    .put((req, res) => post.update(req, res, db))

/**
 * /Comment CRUDS
*/
const comment = require('./app/routes/comment')
app.route('/comment')
    .all()
    .post((req, res) => comment.create(req, res, db))
    .delete((req, res) => comment.delete(req, res, db))
    .put((req, res) => comment.update(req, res, db))