const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 character"],
        minLength: [4, "name should have more than 4 character"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true, // không được trùng nhau,
        validate: [validator.isEmail, "Please enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 character"],
        select: false
    },
    avatar:
    {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

module.exports = mongoose.model("User",userSchema)