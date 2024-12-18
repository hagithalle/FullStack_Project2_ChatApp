const groupModel = require("../Models/groupModel")
const mongoose = require("mongoose")

const getAllGroup= ()=>{
    return groupModel.find({})
}

const getGroupById= async(id)=> {
    return groupModel.findById(id)
}

const createGroup=async(group)=>{
    const newGroup = new groupModel(group)
    await newGroup.save()
    return newGroup
}

const addUserToGroup=async(groupId, userIdToAdd)=>{

     try{
        const group = await groupModel.findById(groupId);
     if (!group) {
        throw new Error('Group not found');
      }
      if (!group.users_id.includes(userIdToAdd)) {
        throw new Error('You are not a member of this group');
      }
      group.users_id.push(userIdToAdd);

      await group.save();
  
      return group;
    } catch (error) {
      throw new Error(error.message);
    }
}

 const getGroupsByUserId=async(userId)=> {
      // Find all groups where the userId exists in the users_id array
      //const groups = await groupModel.find({ users_id: { $in: [userId] } });
      console.log("xxx")

      ///const userObjectId = new mongoose.Types.ObjectId(userId);
        
        // Log to verify the conversion
        ///console.log("Converted userId:", userObjectId);
        
        // Find groups where the userId exists in the users_id array
        const groups = await groupModel.find({ users_id: { $in: [userId] } });

        console.log("Groups found:", groups);
        return groups;

}

const removeUserFromGroup=async(groupId, userId)=>{

    try{
       const group = await groupModel.findById(groupId);
    if (!group) {
       throw new Error('Group not found');
     }
     if (!group.users_id.includes(userId)) {
       throw new Error('user is not a member of this group');
     }

     group.users_id.pull(userIdToAdd);

     await group.save();
 
     return group;
   } catch (error) {
     throw new Error(error.message);
   }
}

const updateGroup=(id, groupData)=>{
  return groupModel.findByIdAndUpdate(id,groupData);
}

const deletedGroup=(id)=>{
  return groupModel.findByIdAndDelete(id);
}


module.exports = {getAllGroup,getGroupById, createGroup, updateGroup, addUserToGroup, removeUserFromGroup, deletedGroup, getGroupsByUserId}