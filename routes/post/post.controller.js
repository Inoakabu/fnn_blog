const ObjectID = require('mongodb').ObjectID

const { Config } = require('../../models');
const { HTTP_STATUS } = require('../../utils');

const dbConf = new Config().db;

module.exports = (router, db) => {
    router.route('/post')
        .post((req, res) => {
            const oHex = new ObjectID().toHexString();
            const nHex = new ObjectID.createFromHexString(oHex).toHexString();
            db.collection(dbConf.collections.posts)
                .save({
                    id: nHex,
                    title: req.body.post_title,
                    content: req.body.post_content
                }, (err, result) => {
                    if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                    // console.log(result)               
                    console.log('[*] Info: Post saved', result.ops[0].id)
                    res.status(HTTP_STATUS.CREATED).json(result.ops[0])
                    db.close;
                })
        })
        .delete((req, res) => {
            db.collection(dbConf.collections.posts)
                .findOneAndDelete({ post_id: req.body.post_id },
                    (err, result) => {
                        if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                        // console.log(result)               
                        console.log('[*] Info: Post deleted:', req.body.post_id)
                    })
            db.collection(dbConf.collections.comments)
                .remove({ post_id: req.body.post_id },
                    (err, result) => {
                        if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                        // console.log(result)               
                        console.log('[*] Info: Comments from Post deleted:', req.body.post_id)
                        res.status(HTTP_STATUS.OK).end()
                        db.close;
                    })
        })
        .put((req, res) => {
            db.collection(dbConf.collections.posts)
                .findOneAndUpdate({ id: req.body.post_id }, {
                    $set: {
                        title: req.body.post_title,
                        content: req.body.post_content
                    }
                }, (err, result) => {
                    if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                    // console.log(result)
                    console.log('[*] Info: Post Updated:', result.value.id)
                    res.status(HTTP_STATUS.OK).json(result.value);
                    db.close;
                })
        });
};