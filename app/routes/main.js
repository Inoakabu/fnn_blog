const config = require('./../config/config.json'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

exports.all = (req, res, db) => {
    db.collection(config.db.collections.posts)
        .aggregate([{
            $lookup: {
                from: config.db.collections.comments,
                localField: 'post_id',
                foreignField: 'post_id',
                as: 'comments'
            }
        }, {
            $sort: { _id: -1 }
        }])
        .toArray((err, result) => {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            // console.log(result)               
            res.status(STATUSCODE.OK).json(result)
            db.close;
        })
}