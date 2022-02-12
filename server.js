//___________________
//Dependencies
//___________________
const express = require('express');
const res = require('express/lib/response');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
const Post = require('./models/post.js')


//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000
app.get('/index', (req,res) => {

    Post.find({}, (err, content) => {
        res.render("index.ejs",{post:content} )
    })
    
})
app.get('/edit' , (req, res) => {
  res.render('edit.ejs');
});

app.get('/show', (req,res) => {
    res.render('show.ejs')
})

app.post('/makePost', (req, res) => {

    Post.create(req.body, (err,newPost) => {
        // console.log(err);
        // console.log("ayooooooooooooooooooo");
        // res.send(newPost)
        res.redirect('/index')
        
    })
})

// route to edit.ejs. will give page dedicated to that specific post
app.get("/edit/poster/:id", (req, res) => {
    Post.findById(req.params.id, (err, thePost) => {
        res.render("edit.ejs", {
            post:thePost
        })
    })
})

// route to update posts after being edited on edit.ejs
app.put('/updatePostById/:id',(req,res) => {

    Post.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error,updatedPost) => {
        res.redirect('/index')
    })
})
app.delete('/deleteById/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (error, data) => {
      res.redirect('/index')
    })
  })
//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));