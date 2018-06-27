var express = require('express');
var app = express();
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient

var db



MongoClient.connect("mongodb://localhost:27017", (err,client)=>{
    if (err) return console.log(err)
    db = client.db('fnn_blog')
    app.listen(3000,()=>{
        console.log('listen 3000')
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

        res.render('index.ejs', {fnn_blog: result})
    })
});

app.post('/addpost', (req,res) => {
    db.collection('fnn_blog')
    .save(req.body,(err,result)=>{
        if (err) return console.log(err)

        console.log('saved')
        res.redirect('/')
    })
});

app.post('/updatePost', (req,res) => {
    console.log(req.body)
    db.collection('fnn_blog')
    .findOneAndUpdate(
        {
            blogposttitle: req.body.findBlogPost //query, lookup
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
    .deleteOne(
        {
            blogposttitle: req.body[findDeleteBlogPost]
        },
        (err,result) => {
            if (err) return res.send(500, err)
            console.log('deleted: '+result)
        }
    )
    console.log('deleted')
    res.redirect('/')
})


// var postSchema = new mongoose.Schema({ body: String });

// var Post = mongoose.model('Post', postSchema);