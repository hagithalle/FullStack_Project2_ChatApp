const messageModel = require("../Models/messageModel")

const getAllMessage= ()=>{
    return messageModel.find({})
}

const getMessageHistory= async(userId)=> {
  console.log("getMessageHistory: ", userId)
      // Fetch the last 20 messages for the user
      const messages = await messageModel.find({
        $or: [
          { sender_id: userId },  // Messages sent by the user
          { receiver_id: userId },  // Messages received by the user
        ]
      })  
      return messages
}


const createMessage=async(message)=>{
    const newMessage = new messageModel(message)
    await newMessage.save()
    return newMessage
}

const updateMessage=(id, messageData)=>{
    return messageModel.findByIdAndUpdate(id, messageData)
}

const deletedMessage=(id)=>{
    return messageModel.findByIdAndDeleted(id)
}



module.exports = {getAllMessage,getMessageHistory, createMessage, updateMessage, deletedMessage}