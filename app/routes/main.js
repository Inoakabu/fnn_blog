const Post = require('./../model/post.js'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

exports.all = (req, res) => {
    Post.find()
        .populate('Comment')
        .exec((err, posts) => {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            console.log(posts)
            res.status(STATUSCODE.OK).json(posts)
        })
}