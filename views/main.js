const express = require('express');
const res = require('express/lib/response');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();

const session = require('express-session')
const signOut = document.querySelector(".signOut")

// does not work
signOut.addEventListener('click', () =>{
    alert('hello')
} )





// Do person schema from mongoose. Make it more simplified than this. 
// Then change the post schema. 

// const userSchema = mongoose.Schema({
//     username: {
//         type: String,
//         trim: true,
//         lowercase: true,
//         required: true,
//         unique: true
//     },
//     email: {
//         type: String,
//         trim: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     tokens: [{
//         access: {
//             type: String
//         },
//         token: {
//             type: String
//         }
//     }],
//     posts: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'post'
//     }]
// }, {
//     timestamps: true
// });
