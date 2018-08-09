const should = require('chai').should(),
    http = require('http'),
    request = require('supertest'),
    config = require('./../config/config.json'),
    STATUSCODE = require('./../helper/StatusCodes').statuses;


beforeEach(function () {
    // setTimeout(3000)
})

// Test
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
});

let postID;
let commentID;

describe("Post Tests", () => {
    it(`POST /addPost should be Code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .post('/addPost')
            .send({ post_title: `Test Title ${new Date}`, post_content: `Post Test ${new Date}` })
            .expect(STATUSCODE.CREATED)
            .end((err, res) => {
                if (err)
                    return done(err)
                postID = res.body.id;
                done();
            })
    })

    it(`POST /addComment add a Comment in previous Post and should be Code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .post('/addcomment')
            .send({ content: `Comment Test #1 ${new Date}`, post_id: postID })
            .expect(STATUSCODE.CREATED)
            .end((err,res) => {
                if (err)
                    return done(err)
                    // res.body.should.be.eql()
                done();
            })
    })

    it(`POST /addComment add a second Comment in previous Post and should be Code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .post('/addcomment')
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

describe("PUT Tests", () => {
    it(`PUT /updatePost and should be code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .put('/updatePost')
            .send({ post_id: postID, post_title: `NEW Test Title`, post_content: `NEW Content Test` })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it(`PUT /updateComment and should be code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .put('/updateComment')
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
    it(`DELETE /deleteComment second Comment in previous Post and should be code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .delete('/deleteComment')
            .send({ comment_id: commentID })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
    it(`DELETE /deletePost previous Post and should be code 200`, (done) => {
        request('http://localhost:' + config.express.port)
            .delete('/deletePost')
            .send({ post_id: postID })
            .expect(STATUSCODE.OK)
            .end((err) => {
                if (err)
                    return done(err)
                done();
            })
    })
});