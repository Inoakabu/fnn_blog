const { Config } = require('../../models');
const { HTTP_STATUS } = require('../../utils');

const dbConf = new Config().db;

module.exports = (router, db) => {
    router.get('/', (req, res) => {
        db.collection(dbConf.collections.posts)
            .aggregate([{
                $lookup: {
                    from: dbConf.collections.comments,
                    localField: 'post_id',
                    foreignField: 'post_id',
                    as: 'comments'
                }
            }, {
                $sort: { _id: -1 }
            }])
            .toArray((err, result) => {
                if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                res.status(HTTP_STATUS.OK).json(result)
                db.close;
            })
    });
};