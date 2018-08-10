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
        })
});

/**
 * Get all Posts handler
 */
router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id)
        .populate('comments', 'content')
        .exec()
        .then(item => {
            res.status(STATUSCODE.OK).json(new feedback(item, { route: 'post', id: true }).all())
        })
});

/**
 * Post a Post handler
 */
router.post("/", (req, res, next) => {
    const post = new Post({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content
    });
    post.save()
        .then(item => {
            logger(`Post saved: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { route: 'post', id: true }).created())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id)
        .exec()
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Post not found.", STATUSCODE.NOT_FOUND))
                return
            }
            res.status(STATUSCODE.OK).json(new feedback(item, { type: "get", route: 'post' }).found())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

router.delete("/:id", (req, res, next) => {
    Post.findByIdAndRemove(req.params.id)
        .exec()
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Post not found.", STATUSCODE.NOT_FOUND))
                return
            }
            logger(`Post deleted: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { type: "post", route: 'post', body: { title: "String", content: "String" } }).deleted())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

router.put("/:id", (req, res, next) => {
        Post.findByIdAndUpdate(req.params.id, req.body)
        .exec()
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Post not found.", STATUSCODE.NOT_FOUND))
                return
            }
            logger(`Post updated: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { route: 'post', id: true }).updated())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

router.patch("/:id", (req, res, next) => {
    const updateOps = {};
    for (const ops in req.body) {
        updateOps[ops] = req.body[ops];
    }
    Post.findByIdAndUpdate(req.params.id, updateOps)
        .exec()
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Post not found.", STATUSCODE.NOT_FOUND))
                return
            }
            logger(`Post patched: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { route: 'post', id: true }).patched())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

module.exports = router;
