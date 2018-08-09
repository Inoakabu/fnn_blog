const config = require('./../config/config.json'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

exports.create = (req, res, db) => {
    db.collection(config.db.collections.comments)
        .save({
            content: req.body.comment_content,
            post_id: req.body.post_id
        }, (err, result) => {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            // console.log(result)               
            console.log('[*] Info: Comment added to', result.ops[0].post_id, result.ops[0].id)
            res.status(STATUSCODE.CREATED).json(result.ops[0])
            db.close;
        })
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