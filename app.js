var express = require('express');
var app = express();
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
// var async = require('async');

var db

MongoClient.connect("mongodb://localhost:27017", (err,client)=>{
    if (err) return console.log(err)
    db = client.db('fnn_blog')
    app.listen(3000,()=>{
        console.log('Server listen on Port 3000')
    })
})

app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
// app.use(express.static('views'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    db.collection('fnn_blog')
    .find()
    .sort({_id:-1})
    .toArray((err,result) => {
        if (err) return console.log(err)
        console.log(result);
        res.render('index.ejs', {fnn_blog: result})
    })
    db.close;
});

app.get('/comment',(req,res)=>{
    db.collection('fnn_blog')
    .aggregate([
        { $lookup:
            {
                from: 'fnn_blog_comment',
                localField: 'uid',
                foreignField: 'linkid',
                as: 'comments'
            }
        }
    ])
    .toArray(function(err,result){
        if(err) return console.log(err)
        console.log(JSON.stringify(result));
        res.render('comment.ejs', {comment: result})
        db.close;
    })
});

app.post('/addpost', (req,res) => {
    var objectId = new ObjectID();
    var originalHex = objectId.toHexString();
    var newObjectId = new ObjectID.createFromHexString(originalHex);
    var newHex = newObjectId.toHexString();
    db.collection('fnn_blog')
    .save({
        blogposttitle: req.body.blogposttitle,
        blogpost: req.body.blogpost,
        uid: newHex
    },(err,result)=>{
        if (err) return console.log(err)

        console.log('saved')
        res.redirect('/')
    })
    db.close;
});

app.post('/addcomment', (req,res) => {
    var objectId = new ObjectID();
    var originalHex = objectId.toHexString();
    var newObjectId = new ObjectID.createFromHexString(originalHex);
    var newHex = newObjectId.toHexString();
    db.collection('fnn_blog_comment')
    .save({
        comment: req.body.comment,
        commentid: newHex,
        linkid: req.body.uid
    },(err,result)=>{
        if (err) return console.log(err)

        console.log('saved')
        res.redirect('/')
    })
    db.close;
});

app.post('/updatePost', (req,res) => {
    console.log(req.body)
    db.collection('fnn_blog')
    .findOneAndUpdate(
        {
            uid: req.body.findBlogPost //query, lookup
        },{
        $set: {
            blogposttitle: req.body.replaceBlogPostTitle,
            blogpost: req.body.replaceBlogPost
        } // update statement
        }, 
        (err, result) => {
            if (err) return res.send(err)
    })
    console.log('updated')
    res.redirect('/')
})

app.post('/deletePost', (req,res) => {
    console.log(req.body)
    db.collection('fnn_blog')
    .findOneAndDelete(
        {
            uid: req.body.deleteBlogPost
        },
        (err,result) => {
            if (err) return res.send(500, err)
            console.log('deleted')
        }
    )
    res.redirect('/')
})

// call if comment have to be deletet AND the Post itself
app.post('/deleteComment', (req,res) => {
    console.log(req.body)
    db.collection('fnn_blog_comment')
    .findOneAndDelete(
        {
            uid: req.body.deleteBlogComment
        },
        (err,result) => {
            if (err) return res.send(500, err)
            console.log('deleted')
        }
    )
    res.redirect('/')
})