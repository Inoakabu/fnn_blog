const { Config } = require('../../models');
const { HTTP_STATUS, vueOptions } = require('../../utils');

const dbConf = new Config().db;
const appConf = new Config().app;

module.exports = (router, db) => {
    router.get('/', (req, res) => {
        db.collection(dbConf.collections.posts)
            .aggregate([{
                $lookup: {
                    from: dbConf.collections.comments,
                    localField: 'id',
                    foreignField: 'post_id',
                    as: 'comments'
                }
            }, {
                $sort: { _id: -1 }
            }])
            .toArray((err, result) => {
                if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                const data = { name: appConf.name, data: result };
                res.renderVue("main/main.vue", data, vueOptions);
                db.close;
            })
    });
};