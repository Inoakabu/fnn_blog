exports.create = (req, res) => {
    const oHex = new ObjectID().toHexString();
    const nHex = new ObjectID.createFromHexString(oHex).toHexString();
    db.collection(config.db.collections.posts)
        .save({
            id: nHex,
            title: req.body.post_title,
            content: req.body.post_content
        }, (err, result) => {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            // console.log(result)               
            console.log('[*] Info: Post saved', result.ops[0].id)
            res.status(STATUSCODE.CREATED).json(result.ops[0])
            db.close;
        })
};

exports.delete = (req, res) => {
    db.collection(config.db.collections.posts)
        .findOneAndDelete({ post_id: req.body.post_id },
            (err, result) => {
                if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                // console.log(result)               
                console.log('[*] Info: Post deleted:', req.body.post_id)
            })
    db.collection(config.db.collections.comments)
        .remove({ post_id: req.body.post_id },
            (err, result) => {
                if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
                // console.log(result)               
                console.log('[*] Info: Comments from Post deleted:', req.body.post_id)
                res.status(STATUSCODE.OK).end()
                db.close;
            })
};

exports.update = (req, res) => {
    db.collection(config.db.collections.posts)
        .findOneAndUpdate({ id: req.body.post_id }, {
            $set: {
                title: req.body.post_title,
                content: req.body.post_content
            }
        }, (err, result) => {
            if (err) res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json(err)
            // console.log(result)
            console.log('[*] Info: Post Updated:', result.value.id)
            res.status(STATUSCODE.OK).json(result.value);
            db.close;
        })
}