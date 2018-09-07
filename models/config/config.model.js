// @ts-check
const path = require("path");

class Config {
    constructor() {
        this.app = {
            name: "Fabby's News Network"
        };
        this.server = {
            root: path.normalize(__dirname + "/.."),
            port: Number(process.env.PORT) || 3000
        };
        this.db = {
            url: process.env.MONGOURL || "mongodb://localhost:27017/fnn_blog",
            port: Number(process.env.DB_PORT) || 27017,
            collections: {
                posts: "fnn_blog",
                comments: "fnn_blog_comment"
            }
        }
        this.twitter = {
            oauth: {
                consumer_key: process.env.TWCO_KEY,
                consumer_secret: process.env.TWCO_SECRET,
                access_token_key: process.env.ACTO_KEY,
                access_token_secret: process.env.ACTO_SECRET
            }
        };
    }
}
module.exports = Config;