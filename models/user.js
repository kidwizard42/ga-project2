const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    // email: {
    //     type: String,
    //     trim: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    // tokens: [{
    //     access: {
    //         type: String
    //     },
    //     token: {
    //         type: String
    //     }
    // }],
    // posts: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post'
    // }]
}, {
    timestamps: true
});


const userCollection = mongoose.model('User',userSchema)

module.exports = userCollection