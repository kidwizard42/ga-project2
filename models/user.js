const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    timestamps: true
});


const userCollection = mongoose.model('User',userSchema)

module.exports = userCollection