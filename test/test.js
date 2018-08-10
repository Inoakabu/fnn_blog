const expect = require('chai').expect
    http = require('http'),
    request = require('supertest'),
    config = require('./../api/config/config.json'),
    STATUSCODE = require('./../api/helper/http-codes'),

    url = `'http://localhost:' + ${config.http.port}`

let post;
let comment;
let content = `Comment Test #2 ABC`

describe("Post Tests", () => {
    it(`POST /post should be Code 200`, (done) => {
        request(url)
            .post('/post')
            .set('x-access-token', config.auth)
            .send({ title: `Test Title ${new Date}`, content: `Post Test ${new Date}` })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                if (err)
                    return done(err)
                post = res.body;
                done();
            })
    })

    it(`POST /comment add a Comment in previous Post and should be Code 200`, (done) => {
        request(url)
            .post('/comment')
            .set('x-access-token', config.auth)
            .send({ content: `Comment Test #1 ${new Date}`, post_id: post._id })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                if (err)
                    return done(err)
                done();
            })
    })

    it(`POST /comment add a second Comment in previous Post and should be Code 200`, (done) => {
        request(url)
            .post('/comment')
            .set('x-access-token', config.auth)
            .send({ content: content, post_id: post._id })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                if (err)
                    return done(err)
                comment = res.body
                done();
            })
    })
});
describe("GET Tests", () => {
    it("GET / should be Code 200", (done) => {
        request(url)
            .get('/')
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it("GET /post should be Code 200", (done) => {
        request(url)
            .get('/post')
            .send({ _id: post._id })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it("GET /comment second Comment should be Code 200", (done) => {
        request(url)
            .get('/comment')
            .send({ _id: comment._id })
            .expect(STATUSCODE.OK)
            .end((err,res) => {
                if (err)
                    return done(err)
                expect(res.body.content).to.equal(comment.content)
                done();
            })
    })
});

describe("PUT Tests", () => {
    it(`PUT /post and should be code 200`, (done) => {
        request(url)
            .put('/post')
            .set('x-access-token', config.auth)
            .send({ _id: post._id, title: `NEW Test Title`, content: `NEW Content Test` })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it(`PUT /comment and should be code 200`, (done) => {
        request(url)
            .put('/comment')
            .set('x-access-token', config.auth)
            .send({ _id: comment._id, content: `NEW Comment content Test` })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
});

describe("DELETE Tests", () => {
    it(`DELETE /comment second Comment in previous Post and should be code 200`, (done) => {
        request(url)
            .delete('/comment')
            .set('x-access-token', config.auth)
            .send({ _id: comment._id })
            .expect(STATUSCODE.NO_CONTENT)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it(`DELETE /post previous Post and should be code 401`, (done) => {
        request(url)
            .delete('/post')
            .send({ _id: post._id })
            .expect(STATUSCODE.UNAUTHORIZED)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it(`DELETE /post previous Post and should be code 200`, (done) => {
        request(url)
            .delete('/post')
            .set('x-access-token', config.auth)
            .send({ _id: post._id })
            .expect(STATUSCODE.NO_CONTENT)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
});