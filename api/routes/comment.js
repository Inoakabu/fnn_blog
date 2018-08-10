const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * Logger
 */
const logger = require("debug")("dev:comment");

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
const Comment = require("../models/comment");
const Post = require("../models/post");


/**
 * Get all Comments handler
 */
router.get("/", (req, res, next) => {
    Comment.find()
        .select("content _id")
        .populate('post', 'title content')
        .exec()
        .then(items => {
            res.status(STATUSCODE.OK).json({
                count: items.length,
                comments: items.map(item => {
                    let back = new feedback(item, { route: 'comment', id: true }).all();
                    back.entry.post = new feedback(item.post, { route: 'post', id: true }).all()
                    return back;
                })
            })
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

/**
 * Get all Comments handler
 */
router.get("/:id", (req, res, next) => {
    Comment.findById(req.params.id)
        // .select("content _id")
        .populate('post', 'title content')
        .exec()
        .then(item => {
            let back = new feedback(item, { route: 'comment', id: true }).all();
            back.entry.post = new feedback(item.post, { route: 'post', id: true }).all()
            res.status(STATUSCODE.OK).json(back)
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});
/**
 * Post a Post handler
 */
router.post("/:id", (req, res, next) => {
    Post.findById(req.params.id)
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Post not found.", STATUSCODE.NOT_FOUND))
                return
            }
            const comment = new Comment({
                _id: mongoose.Types.ObjectId(),
                content: req.body.content,
                post: req.params.id
            });
            item.comments.push(comment)
            item.save();
            return comment.save();
        }).then(item => {
            logger(`Comment saved: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { route: 'comment', id: true }).created())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

router.delete("/:id", (req, res, next) => {
    Comment.findByIdAndRemove(req.params.id)
        .exec()
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Comment not found.", STATUSCODE.NOT_FOUND))
                return
            }
            logger(`Comment deleted: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { type: "post", route: 'comment', body: { title: "String", content: "String" } }).deleted())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

router.put("/:id", (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.id, req.body)
        .exec()
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Comment not found.", STATUSCODE.NOT_FOUND))
                return
            }
            logger(`Comment updated: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { route: 'comment', id: true }).updated())
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
    Comment.findByIdAndUpdate(req.params.id, updateOps)
        .exec()
        .then(item => {
            if (!item) {
                next(new HTTP_ERROR("Comment not found.", STATUSCODE.NOT_FOUND))
                return
            }
            logger(`Comment patched: ${item._id}`)
            res.status(STATUSCODE.OK).json(new feedback(item, { route: 'comment', id: true }).patched())
        }).catch(err => {
            logger(err.message);
            next(new HTTP_ERROR('Check the input.', STATUSCODE.SERVER_ERROR));
            return
        });
});

module.exports = router;
