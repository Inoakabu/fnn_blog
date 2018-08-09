const config = require('./../config/config.json'),
    Schema = require('./../model/comment.js'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

exports.create = (req, res, db) => {
    new Schema(req.body).save((err, comment) => {
        if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
        console.log(comment)
        res.status(STATUSCODE.CREATED).json(comment)
    });
}

exports.delete = (req, res, db) => {
    db.collection(config.db.collections.comments)
        .findOneAndDelete({ id: req.body.comment_id },
            (err, result) => {
                if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                // console.log(result)
                console.log('[*] Info: Comment deleted:', result.value.id)
                res.status(STATUSCODE.OK).end()
                db.close;
            }
        )
}

exports.update = (req, res, db) => {
    db.collection(config.db.collections.comments)
        .findOneAndUpdate({ id: req.body.comment_id }, {
            $set: {
                content: req.body.comment_content
            }
        }, (err, result) => {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            // console.log(result)            
            console.log('[*] Info: Comment Updated:', result.value.id)
            res.status(STATUSCODE.OK).json(result.value);
            db.close;
        })
}