const userModel = require("../Models/userModel")

const getAllUser= ()=>{
    return userModel.find({})
}
const getUserById= (id)=>{
    return userModel.findById(id);  
}

const getUserByEmail=(email)=>{
    return userModel.findOne({email: email})
}

const createNewUser=async(userData)=>{
    const newUser = new userModel(userData)
    await newUser.save()
    return newUser
}

const updateUser=(id, userData)=>{
    return userModel.findByIdAndUpdate(id, userData)
}

module.exports = {getAllUser,getUserById, getUserByEmail, createNewUser, updateUser}