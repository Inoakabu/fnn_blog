var update = document.getElementById('update')

update.addEventListener('click',function(){
    console.log('was clicked')
    fetch('updatePost',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'blogposttitle': req.body.replaceBlogPostTitle,
            'blogpost': req.body.replaceBlogPost
        })
    })
    .then(res => {
        if(res.ok) return res.json()
    })
    .then(data => {
        console.log(data)
        window.location.reload()
    })
})

var del = document.getElementById('delete')
console.log(del)
del.addEventListener('click',function(){
    console.log('was clicked')
    fetch('deletePost',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'blogposttitle': req.body.findDeleteBlogPost
        })
    })
    .then(res => {
        if(res.ok) return res.json()
    })
    .then(data => {
        console.log("From Fetch: "+data)
        window.location.reload()
    })
})