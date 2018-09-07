const {
    Config,
    TweetModel
} = require("../../models");

const { HTTP_STATUS } = require("../../utils");
const twitterConf = new Config().twitter;
const Twitter = require('twitter')(twitterConf.oauth);

const EventEmitter = require('events');
const Stream = new EventEmitter();

/**
 * Main Route Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/twitter/stream/:query",
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            res.set({
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                // 'Connection': 'keep-alive',
                "Access-Control-Allow-Origin": "*"
            })

            Twitter.stream('statuses/filter', { track: req.params.query },
                /**
                 * @param {object} tweet
                 */
                (tweet) => {
                    tweet.on('data',
                        /**
                         * @param {object} tweet
                         */
                        (tweet) => {
                            Stream.emit("push", "tweet", new TweetModel(tweet));
                        });
                    tweet.on('error',
                        /**
                         * @param {object} err
                         */
                        (err) => {
                            console.log(err)
                            Stream.emit("push", "error", err);
                        });
                })


            Stream.on("push",
                /**
                 * @param {String} event
                 * @param {String} data
                 */
                (event, data) => {
                    console.log(data)
                    res.write(`event: ${event}\ndata:${JSON.stringify(data)}\n\n`);
                });
        }
    );
};