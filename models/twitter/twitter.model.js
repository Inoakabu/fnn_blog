// @ts-check

/**
 * @typedef TweetType
 * @prop {string} text
 * @prop {Array} hashtags
 * @prop {Object} entities
 */

class TweetModel {
    /**
     * @constructor
     * @param {TweetType} tweet
     * @prop {String} text
     * @prop {String[]} hashtags
     * @prop {String} image
     */
    constructor(tweet) {
        this.id = tweet.id_str
        this.text = tweet.text
        this.hashtags = tweet.entities.hashtags.map(tag => tag.text)
        if (tweet.entities.media) {
            tweet.entities.media.forEach(media => {
                this.text = this.text.replace(String(media.url), "")
                this.image = media.media_url_https
            });
        }
    }
}

module.exports = TweetModel;