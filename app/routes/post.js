const Schema = require('./../model/post.js'),
    Comments = require('./../model/comment.js'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;


exports.get = (req, res) => {
    Schema.findById(req.body)
        .then(post => {
            // console.log(post)
            console.log('[*] Info: Post showed:', post._id)
            res.status(STATUSCODE.OK).json(post)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
};

exports.create = (req, res) => {
    Schema.create(req.body)
        .then(post => {
            // console.log(post)
            console.log('[*] Info: Post created:', post._id)
            res.status(STATUSCODE.CREATED).json(post)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
};

exports.delete = (req, res) => {
    Schema.findOneAndDelete({ _id: req.body._id })
        .then(post => {
            if (!post) {
                return res.status(STATUSCODE.NOT_FOUND).end()
            }
            Comments.findByIdAndDelete(({ post_id: req.body._id }));
            console.log('[*] Info: Post deleted:', post._id)
            res.status(STATUSCODE.NO_CONTENT).json(post)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
};

exports.update = (req, res) => {
    Schema.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(post => {
            if (!post) {
                return res.status(STATUSCODE.NOT_FOUND).end()
            }
            console.log('[*] Info: Post updated:', post._id)
            res.status(STATUSCODE.OK).json(post)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
}