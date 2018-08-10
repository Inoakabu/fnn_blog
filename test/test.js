"use strict";

const should = require("should");
require("should-http"); // this patches global object
const request = require("supertest");
const config = require("./../api/config/config");
const STATUSCODE = require("./../api/helper/http-codes");

const baseURL = `http://${config.http.ip}:${config.http.port}`;

describe("GET /", () => {
    it("should send status 200 and empty body", done => {
        request(baseURL)
            .get("/")
            .expect(STATUSCODE.OK)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("count");
                res.body.should.have.property("posts");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
})

let post;
let comment = { a: null, b: null };

describe("POST - Create a Post and Comment to it", () => {
    it("create a new post and should send status 201", done => {
        request(baseURL)
            .post("/post")
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ title: "Ich bin ein Test", content: "Geiler Text" })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.should.have.property("request");
                post = res.body.entry;
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("create a new comment and should send status 201", done => {
        request(baseURL)
            .post("/comment/" + post._id)
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ content: "Geiler Text" })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.should.have.property("request");
                comment.a = res.body.entry

                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("create a second comment and should send status 201", done => {
        request(baseURL)
            .post("/comment/" + post._id)
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ content: "Geiler Text 2" })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.should.have.property("request");
                comment.b = res.body.entry
                console.log()
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("create a comment with a  post ID and should send status 404", done => {
        request(baseURL)
            .post("/comment/" + post._id.replace("5", "6"))
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ content: "Geiler Text 2" })
            .expect(STATUSCODE.NOT_FOUND)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("error");
                console.log()
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("create a comment with a complete invalid post ID and should send status 500", done => {
        request(baseURL)
            .post("/comment/" + "abc")
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ content: "Geiler Text 2" })
            .expect(STATUSCODE.SERVER_ERROR)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("error");
                console.log()
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
})

describe("GET /???/:id", () => {
    it("search post and should send status 200", done => {
        request(baseURL)
            .get("/post/" + post._id)
            .expect(STATUSCODE.OK)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.should.have.property("request");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("search first comment and should send status 200", done => {
        request(baseURL)
            .get("/comment/" + comment.a._id)
            .expect(STATUSCODE.OK)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.should.have.property("request");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("search second comment and should send status 200", done => {
        request(baseURL)
            .get("/comment/" + comment.b._id)
            .expect(STATUSCODE.OK)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.should.have.property("request");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
})

let update = { title: "Mega Guter Update Text", content: "Text Update" }
describe("patch /???/:id", () => {
    it("update the title text of the post and should send status 200", done => {
        request(baseURL)
            .patch("/post/" + post._id)
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ title: update.title })
            .expect(STATUSCODE.OK)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.entry.title.should.equal(update.title);
                res.body.should.have.property("request");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("update the content text of the post and should send status 200", done => {
        request(baseURL)
            .patch("/post/" + post._id)
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ content: update.content })
            .expect(STATUSCODE.OK)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("message");
                res.body.should.have.property("entry");
                res.body.entry.content.should.equal(update.content);
                res.body.should.have.property("request");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("try update text of invalid post id and should send status 404", done => {
        request(baseURL)
            .patch("/post/" + post._id.replace("5", "8"))
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ title: update.title })
            .expect(STATUSCODE.NOT_FOUND)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("error");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
})

describe("delete /???/:id", () => {
    it("delete second comment and should status 204", done => {
        request(baseURL)
            .delete("/comment/" + comment.b._id)
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(STATUSCODE.NO_CONTENT)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.empty()
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it("delete post and should status 204", done => {
        request(baseURL)
            .delete("/post/" + post._id)
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(STATUSCODE.NO_CONTENT)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.empty()
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
    it.skip("delete first comment and should status 404", done => {
        request(baseURL)
            .delete("/comment/" + comment.a._id)
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(STATUSCODE.NOT_FOUND)
            .end((err, res) => {
                should.not.exists(err); // this leads to immediate throw
                res.body.should.have.property("error");
                done(err); // standard mocha wants done(err) to be called to detect errors, but we use should.not.exist(err) above that directly thows
            })
    })
})
