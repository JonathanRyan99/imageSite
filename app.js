const express = require('express');
const mongoose = require('mongoose');
const wallpapers = require('./models/wallpaperModel');
//when a request is made to this express server, express reads down this page looking for a response that fits
//if it does and the response is triggered that is the end of the interaction and does not travel further down the page.


//express app
const app = express();


//connect to database
mongoose.connect('mongodb://localhost/ImageBoard',{ useUnifiedTopology: true , useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connection successful");
  app.listen(3000);//listen for requests on port 3000
});



//register the view engine (using embedded javascript templates or ejs)
app.set('view engine', 'ejs');
//app.set('views','customViewFolder');

//middle ware static files
app.use(express.static('public'));
//middle wear that decodes/encodes post request information
app.use(express.urlencoded({extended: true}));


//get browser request and reply with rendered page
app.get('/', ( req, res) => {
    res.render('landing', {title: 'Imageboard'});
});


//index page shows all
app.get('/index',(req,res) => {
    wallpapers.find()
    .then((result) => {
       res.render('index', {title: 'index', wallpapers: result});
    })
    .catch((err) => {
        console.log(err);
    });

});


//tag search
app.post('/index',(req,res) =>{
    //imformation from page stored in req.body search = req.body.userSearch
    console.log(req.body);
    wallpapers.find({tags: req.body.userSearch})
    .then((result) => {
        res.render('index', {title: 'index', wallpapers: result});
    })
    .catch((err) => {
        console.log(err);
    })
});



//displays singluar requested page
app.get('/content/:id', ( req, res) => {
    const id = req.params.id;
    wallpapers.findById(id)
    .then((result)=>{
        res.render('content', {title: 'content', wallpapers: result})
    })
    .catch((err) => {
        console.log(err);

    })
});



//update tags on content page
app.post('/content/:id',(req,res) =>{
    console.log(req.body);
    id = req.body.id
    wallpapers.updateOne({_id : req.body.id} ,{$addToSet : {tags: req.body.newTag }})
    .then((result) => {
        console.log("update successful");
    })
    .catch((err) => {
        console.log(err);
    })

    wallpapers.findById(id)
    .then((result)=>{
        res.render('content', {title: 'content', wallpapers: result})
    })
    .catch((err) => {
        console.log(err);

    })

});




app.get('/upload', ( req, res) => {
    res.render('upload', {title: 'Upload'});
});


//404 page
//"use" will fire with every request. unlike "get" it is not tied to a particualr url request
//however it will only fire if the program gets this far e.g it doesnt meet any of the get requirments above
app.use((req,res) => {

    res.status(404).render('404', {title: '404 Error'});

});
