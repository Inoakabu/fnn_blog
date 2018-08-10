const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * Logger
 */
const logger = require("debug")("dev:post");

/**
 * Config and Helpers
 */
const config = require('./../config/config.json')
const STATUSCODE = require('./../helper/http-codes')
const HTTP_ERROR = require('./../helper/http-error')
const feedback = require('./../helper/feedback')

/**
 * Models
 */
const Post = require("../models/post");


/**
 * Get all Posts handler
 */
router.get("/", (req, res, next) => {
    Post.find()
        .select("comments content _id")
        .populate('comments')
        .exec()
        .then(items => {
            res.status(STATUSCODE.OK).json({
                count: items.length,
                posts: items.map(item => new feedback(item, { route: 'post', id: true }).all())
            })
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
})

module.exports = router;
