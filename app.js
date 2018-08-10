"use strict";
const express = require("express");
const app = express();

/**
 * Config and Helpers
 */
const config = require('./api/config/config.json')
const STATUSCODE = require('./api/helper/http-codes')
const HTTP_ERROR = require('./api/helper/http-error')

/**
 * Logger
 */
const logger = require("debug")("dev:app");
const requestLogger = require("morgan");

// app.use(requestLogger("dev"));

/**
 * Mongo DB
 */
const mongoose = require("mongoose");
mongoose.connect(`mongodb://${config.db.ip}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true }, (err) => {
    if (err) {
        logger("[!] First start the DB.")
        process.exit();
        return
    }
    logger(`[*] Connected to MongoDB`)
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
// db.dropDatabase(); // clear DB!

/**
 * Body Parser
 */
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Access Control
 */

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(STATUSCODE.OK).json({});
    }
    next();
});

/**
 * Own Routes
 */
const postRoute = require("./api/routes/post");
const commentRoute = require("./api/routes/comment");
app.use("/post", postRoute);
app.use("/comment", commentRoute);


/**
 * Error Handeling
 */
app.use((req, res, next) => {
    const error = new HTTP_ERROR("Not found", STATUSCODE.NOT_FOUND);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || STATUSCODE.SERVER_ERROR);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
