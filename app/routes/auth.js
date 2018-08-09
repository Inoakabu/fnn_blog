const config = require('./../config/config.json'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;

module.exports = (req, res, next, db) => {
    console.log('was du?', req.body)
    if(req.headers['x-access-token'] === "123") {
        next()
    } else {
        res.status(STATUSCODE.UNAUTHORIZED).end()        
    }

};