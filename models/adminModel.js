const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name Required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name Required"]
    },
 
    email: {
        type: String,
        required: [true, "Email Required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password Required"]
    },
    adminVerify: {
        type: Boolean,
        default: false
    },
   
    token: {
        type: String
    }
}, {
    timestamps: true
})

const adminModel = mongoose.model('admin', adminSchema)

module.exports = adminModel  