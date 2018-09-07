const {
    Config,
    TweetModel
} = require("../../models");

const { HTTP_STATUS } = require("../../utils");
const twitterConf = new Config().twitter;
const Twitter = require('twitter')(twitterConf.oauth);

/**
 * Main Route Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/twitter/:name",
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            let tweets
            try {
                tweets = await Twitter.get('statuses/user_timeline', {
                    screen_name: req.params.name
                })
                res.status(HTTP_STATUS.OK).json(tweets.map(tweet => new TweetModel(tweet)))
            } catch (err) {
                console.warn(err)
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
            }
        }
    );
};