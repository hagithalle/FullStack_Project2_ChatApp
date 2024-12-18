const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: [true, "Please add a full name"]
    },
    userName:{
        type: String,
        require: [true, "Please add a user name"]
    },
    email:{
        type: String,
        require: [true, "Please add a eamil"]
    },
    password:{
        type: String,
        equired: [true, "Please add a password"]
    }
})

module.exports= mongoose.model("user", userSchema)