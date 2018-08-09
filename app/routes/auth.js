const config = require('./../config/config.json'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

module.exports = (req, res, next, db) => {
    if(req.headers['x-access-token'] === config.auth) {
        next()
    } else {
        res.status(STATUSCODE.UNAUTHORIZED).end()        
    }

};