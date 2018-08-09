const Schema = require('./../model/comment.js'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

exports.get = (req, res) => {
    Schema.findById(req.body)
        .then(comment => {
            // console.log(comment)
            console.log('[*] Info: Comment showed:', comment._id)
            res.status(STATUSCODE.OK).json(comment)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
};
exports.create = (req, res) => {
    Schema.create(req.body)
        .then(comment => {
            // console.log(comment)
            console.log('[*] Info: Comment created:', comment._id)
            res.status(STATUSCODE.CREATED).json(comment)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
}

exports.delete = (req, res) => {
    Schema.findOneAndDelete({ _id: req.body._id })
        .then(comment => {
            if (!comment) {
                return res.status(STATUSCODE.NOT_FOUND).end()
            }
            console.log('[*] Info: Comment deleted:', comment._id)
            res.status(STATUSCODE.NO_CONTENT).json(comment)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
}

exports.update = (req, res) => {
    Schema.findByIdAndUpdate({ _id: req.body._id }, req.body)
        .then(comment => {
            if (!comment) {
                return res.status(STATUSCODE.NOT_FOUND).end()
            }
            console.log('[*] Info: Comment updated:', comment._id)
            res.status(STATUSCODE.OK).json(comment)
        })
        .catch(err => {
            console.error(err);
            res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        });
}