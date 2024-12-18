const groupRepo = require("../Repositories/groupRepo")

const getAllGroup= ()=>{
    return groupRepo.getAllGroup()
}

const getGroupById= async(id)=> {
    return groupRepo.getGroupById(id)
}

const createGroup=async(group)=>{
   try{
    const newGroup = await groupRepo.createGroup(group)
    if(!newGroup){
        return {message: "User created failed", success: false}
    }
    return {message: "Group created successfully", success: true}
   }
   catch(error){
    return {message:`Error when creating new group: ${error}`, success: false}
   }
}


const addUserToGroup=async(groupId, userId)=>{
    try {
        const group= await groupRepo.addUserToGroup(groupId,userId)
        return {message: "Add user to group successfully", success: true, group}
        
    } catch (error) {
        return {message:`Add user to group was err: ${error}`, success: false}
    }
}

const updateGroup=async(groupId, groupData)=>{
    try {
        const group= await groupRepo.updateGroup(groupId,groupData)
        return {message: "Add update group successfully", success: true, group}
        
    } catch (error) {
        return {message:`Add update group was err: ${error}`, success: false}
    }
}

const removeUserFromGroup=async(groupId, userId)=>{
    try {
        const group= await groupRepo.removeUserFromGroup(groupId,userId)
        return {message: "remove user from group successfully", success: true, group}
        
    } catch (error) {
        return {message:`remove user from group was err: ${error}`, success: false}
    }
}

const deletedGroup=async(id)=>{
    try {
           const result= await groupRepo.deletedGroup(id)
           return {message: "Deleted group successfully", success: true }
        
       } 
       catch (error)
       {
            return { message: `Deleted group failed: ${error}`, success: false };
       }
    }

    const getGroupsByUserId=(userId)=>{
        try {
            console.log("getGroupsByUserId server: ", userId )
            return groupRepo.getGroupsByUserId(userId)
            
           } 
           catch (error)
           {
            throw new Error('Error retrieving groups');
           }
        }

module.exports = {getAllGroup,getGroupById, createGroup,updateGroup, addUserToGroup, removeUserFromGroup,deletedGroup, getGroupsByUserId}