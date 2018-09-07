const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    glob = require("glob"),
    expressVue = require('express-vue'),
    session = require('express-session'),
    passport = require('passport'),

    { Config } = require('./models');

require('dotenv').config()

const serverConf = new Config().server;
const dbConf = new Config().db;

const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const vueOptions = {
    rootPath: path.join(__dirname, "routes")
};

const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

app.use(session({
    name: "session",
    keys: [
        "FNN",
    ],
    secret: 'secretscret',
    saveUninitialized: false,
    resave: false
}));

mongoose.connect(`${dbConf.url}`, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("[!] First start the DB.")
        process.exit();
        return
    } else {
        console.log(`[*] Connected to MongoDB`)
        app.listen(serverConf.port, () => {
            console.log(`[*] Express runs on localhost:${serverConf.port}`)
        })
    }
});

const db = mongoose.connection;
// db.dropDatabase(); // clear DB!

app.use("/", router);


// Reads the `Routes`-folder and require
let controllers = glob.sync('./routes/**/*.js');
controllers.forEach((controller) => {
    module.require(controller)(router, db, passport);
});
