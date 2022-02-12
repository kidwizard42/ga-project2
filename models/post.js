const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    poster: {type:String, required:true},
    content: {type:String, required:true},
    likes:{type: Number, default:0},
    dislikes:{type: Number, default:0}
},{ timestamps: true })

const postCollection = mongoose.model('Post',postSchema)

module.exports= postCollection