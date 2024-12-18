const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
      },
    receiver_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
      },
      messageText:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    }
})

module.exports= mongoose.model("message", messageSchema)