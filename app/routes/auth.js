const config = require('./../config/config.json'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

moduls.export = (req, res, db) => {
    if(req.body.token === "123") {
        res.next()
    } else {
        res.status(STATUSCODE.UNAUTHORIZED).end();
    }
};