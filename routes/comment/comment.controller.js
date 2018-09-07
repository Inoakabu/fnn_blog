const ObjectID = require('mongodb').ObjectID

const { Config } = require('../../models');
const { HTTP_STATUS } = require('../../utils');

const dbConf = new Config().db;

module.exports = (router, db) => {
    router.route('/comment')
        .post((req, res) => {
            const oHex = new ObjectID().toHexString();
            const nHex = new ObjectID.createFromHexString(oHex).toHexString();
            db.collection(dbConf.collections.comments)
                .save({
                    id: nHex,
                    content: req.body.comment_content,
                    post_id: req.body.post_id
                }, (err, result) => {
                    if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                    console.log('[*] Info: Comment added to', result.ops[0].post_id, result.ops[0].id)
                    res.status(HTTP_STATUS.CREATED).json(result.ops[0])
                    db.close;
                })
        })
        .delete((req, res) => {
            db.collection(dbConf.collections.comments)
                .findOneAndDelete({ id: req.body.comment_id },
                    (err, result) => {
                        if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                        // console.log(result)
                        console.log('[*] Info: Comment deleted:', result.value.id)
                        res.status(HTTP_STATUS.OK).end()
                        db.close;
                    }
                )
        })
        .put((req, res) => {
            db.collection(dbConf.collections.comments)
                .findOneAndUpdate({ id: req.body.comment_id }, {
                    $set: {
                        content: req.body.comment_content
                    }
                }, (err, result) => {
                    if (err) res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
                    // console.log(result)            
                    console.log('[*] Info: Comment Updated:', result.value.id)
                    res.status(HTTP_STATUS.OK).json(result.value);
                    db.close;
                })
        });
};