const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    users_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
      }],
    })

    module.exports= mongoose.model("group", groupSchema)