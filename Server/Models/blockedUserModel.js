const mongoose = require("mongoose")


const blockedUserSchema = new mongoose.Schema({
    user_id: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'user',  // This will reference the User model
      required: true
    },
    blocked_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',  // This will also reference the User model
      required: true
    }
  });

  module.exports= mongoose.model("blockedUser", blockedUserSchema)