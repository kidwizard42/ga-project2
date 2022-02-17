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
const User = require('./models/user.js')
const session = require('express-session')
const flash = require('connect-flash')
const bcrypt = require('bcrypt')



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
// db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
// db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
// db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

// used to keep people logged in.
app.use(session({
    secret:"heTYellowbusSaIdwhatt64fse3342fhgg77673nd3n4fdassentenc,",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

// can now use flash
app.use(flash());
//allows use of method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000


// The homepage. login or create
app.get('/',(req,res) => {
        res.render("login.ejs",
        {fail:req.flash('failure'),
        exists:req.flash('exists'),
        newA:req.flash('newAcount'),
        blank:req.flash('blank'), // no longer need
        cpuLoggedYouOut:req.flash('out')
    })
})

// a post route if you attempt to login.
app.post('/login/user',(req,res) =>{
    // doesnt Work will send the flash but the page crashes
    // if(!req.body.user){
    //     req.flash('blank', 'user cannot be blank')
    //     res.redirect('/')
    // }

    User.findOne({user:req.body.user}, (err, person) => {
        
        if(!person){
            // alert('incorrect username or password. Please try again')
            req.flash('failure', 'Incorrect Username or password. Please try again')
           res.redirect('/')
        }else if (person){
            if (bcrypt.compareSync(req.body.password, person.password)) {
            req.session.user = person.user
            req.session.userId = person._id
            res.redirect('/index')
            } else{
                req.flash('failure', 'Incorrect Username or password. Please try again')
                res.redirect('/')
            }
        }  
    })
})
// create a new account
app.post('/create/user',(req,res) => {
    // does not work
    // if(!req.body.user){
    //     req.flash('blank', 'User cannot be blank')
    //     res.redirect('/')
    // }

    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12))

    User.findOne({user:req.body.user}, (err, alreadyExists) => {
            // checks if the user exists. if it does it won't be made.
        if(alreadyExists){
            req.flash('exists', 'This account already exists, please try again')
            res.redirect('/')
        }else{
            User.create( req.body, (err, newUser) => {
                req.flash('newAcount', ` ${newUser.user} was created! Now you just need to sign in. :)`)
                res.redirect('/')
        })
        }
    })
})

// sign out
app.post('/logout',(req,res) => {
    req.session.user = null
    req.session.userId = null
    res.redirect('/')
})

// loads index page if you have an account
app.get('/index', (req,res) => {
    if (req.session.user){
    Post.find({}, (err, content) => {

        res.render("index.ejs",{
            user:req.session.user,
            post:content,
            id: req.session.userId
        })
    })
} else {
    req.flash('out', 'Please sign In')
        res.redirect('/')} 
})


app.get('/edit' , (req, res) => {
  res.render('edit.ejs');
});

app.get('/show/:id',  (req,res) => {

    if (req.session.user){
        User.findById(req.params.id, (err, account) => {
            // res.send(account)
            res.render('show.ejs',{
                userAccount: account
            })
        }).populate('posts')
            
       
    } else {
        req.flash('out', 'Please sign In')
        res.redirect('/')
    }
    
})

app.post('/makePost', (req, res) => {
    // puts poster  & poster ID into the post schema
    req.body.poster = req.session.user
    req.body.user = req.session.userId 
    
// res.send(req.body)
// creates the post w user and content
    Post.create(req.body,  async (err,newPost) => {

        // DOES NOT WORK. Should add the post id to the array of the user but does not.
        //  push and unshift gave errors but splice doesnt giv work 
        // UPDATE PUSH NO LONGER GIVES ME ISSUES BUT STILL NOTHING GETS PUSHED TO MY ARRAY

// decide to delete???
//         User.findOne({user:newPost.poster}, (err, originalUser) =>  {
//             // console.log(originalUser.posts)
//             // console.log(newPost._id);
//             // originalUser.posts.splice(0,0,newPost._id)
//             originalUser.posts.push(newPost._id)
// // YEOOOOOOO ORIGINALLY IT WAS JUST FIND. WE NEED TO TRY THE UPDATE AND SEE IF WE CAN PASS A PUSH INT
//             console.log(originalUser)
//             console.log(originalUser.posts)
//             res.redirect('./index')
//         })


        //  finafuckingly pushes the post id to the user posts array.
       await User.findOneAndUpdate({user:newPost.poster}, {$push:{posts:newPost._id}})
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





