const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: {type:String, required:true},
    // links to the id
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // gives the name of the account
    poster: String
},{ timestamps: true })

const postCollection = mongoose.model('Post',postSchema)

module.exports= postCollection

// likes:{type: Number, default:0},
//     dislikes:{type: Number, default:0}