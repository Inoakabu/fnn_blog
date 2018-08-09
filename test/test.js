const should = require('chai').should(),
    http = require('http'),
    request = require('supertest'),
    config = require('./../app/config/config.json'),
    STATUSCODE = require('./../app/helper/StatusCodes').statuses;


beforeEach(function () {
    // setTimeout(3000)
})

let postID;
let commentID;

describe("Post Tests", () => {
    it(`POST /post should be Code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .post('/post')
            .send({ post_title: `Test Title ${new Date}`, post_content: `Post Test ${new Date}` })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                if (err)
                    return done(err)
                postID = res.body.id;
                done();
            })
    })

    it(`POST /comment add a Comment in previous Post and should be Code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .post('/comment')
            .send({ content: `Comment Test #1 ${new Date}`, post_id: postID })
            .expect(STATUSCODE.CREATED)
            .end((err,res) => {
                if (err)
                    return done(err)
                    // res.body.should.be.eql()
                done();
            })
    })

    it(`POST /comment add a second Comment in previous Post and should be Code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .post('/comment')
            .send({ content: `Comment Test #2 ${new Date}`, post_id: postID })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                if (err)
                    return done(err)
                commentID = res.body.id
                done();
            })
    })
});

describe("Get Tests", () => {
    it("GET / should be Code 200", (done) => {
        request('http://localhost:' + config.express.port)
            .get('/')
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it("GET /post should be Code 200", (done) => {
        request('http://localhost:' + config.express.port)
            .get('/post')
            .send({ post_id: postID })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
});

describe("PUT Tests", () => {
    it(`PUT /post and should be code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .put('/post')
            .send({ post_id: postID, post_title: `NEW Test Title`, post_content: `NEW Content Test` })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it(`PUT /comment and should be code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .put('/comment')
            .send({ comment_id: commentID, comment_content: `NEW Comment content Test` })
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
        request('http://localhost:' + config.express.port)
            .delete('/comment')
            .send({ comment_id: commentID })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it(`DELETE /post previous Post and should be code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .delete('/post')
            .send({ post_id: postID })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
});