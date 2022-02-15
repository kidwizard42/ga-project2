const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: {type:String, required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},{ timestamps: true })

const postCollection = mongoose.model('Post',postSchema)

module.exports= postCollection

// likes:{type: Number, default:0},
//     dislikes:{type: Number, default:0}