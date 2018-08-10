"use strict";

/**
 * Config and Helpers
 */
const config = require('./../config/config.json')

class FeedBack {
    constructor(item, { type = "get", route, id = false, body }) {
        this.item = item
        this.type = type;
        this.route = route;
        this.showid = id;
        this.body = body;
    }
    entry() {
        return {
            _id: this.item._id,
            title: this.item.title,
            content: this.item.content,
            comments: this.item.comments,
            post: this.item.post
        }
    }
    
    request() {
        return {
            type: this.type.toUpperCase(),
            url: `http://${config.http.ip}:${config.http.port}/${this.route}/${this.showid ? this.item._id : ""}`,
            body: this.body,

        }
    }
    all() {
        return {
            entry: this.entry(),
            request: this.request()
        }
    }
    created() {
        return {
            message: `Created ${this.route} successfully.`,
            entry: this.entry(),
            request: this.request()
        }
    }
    found() {
        return {
            message: `Found ${this.route} successfully.`,
            entry: this.entry(),
            request: this.request()
        }
    }
    updated() {
        return {
            message: `Updated ${this.route} successfully.`,
            entry: this.entry(),
            request: this.request()
        }
    }
    patched() {
        return {
            message: `Patched ${this.route} successfully.`,
            entry: this.entry(),
            request: this.request()
        }
    }
    deleted() {
        return {
            message: `Deleted ${this.route} successfully.`,
            request: this.request()
        }
    }
}

module.exports = FeedBack;
