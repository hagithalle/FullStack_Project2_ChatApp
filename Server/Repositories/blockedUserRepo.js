const blockedUserModel = require("../Models/blockedUserModel");

const getAllBlockedUsers= ()=>{
    return blockedUserModel.find({})
}

// Block a user
const createBlockedUser = async (user_id, blocked_user_id) => {
    try {
        const newBlockedUser = new blockedUserModel({ user_id, blocked_user_id });
        await newBlockedUser.save();
        return newBlockedUser;
    } catch (error) {
        throw new Error('Error blocking user');
    }
};

// Delete blocked user
const deleteBlockedUser = async (user_id, blocked_user_id) => {
    try {
        console.log("deleteBlockedUser:",user_id, blocked_user_id)
        return await blockedUserModel.deleteOne({ user_id, blocked_user_id });
    } catch (error) {
        throw new Error('Error deleting blocked user');
    }
};

const getAllBlockUsersByUserId=async(user_id)=>{
    try {
        return await blockedUserModel.find({ user_id }).populate('blocked_user_id');
    } catch (error) {
        throw new Error('error fetching blocked users');
    }
   
};

const isBlockedUser = async (user_id, blocked_user_id) => {
    try {
        console.log("deleteBlockedUser:",user_id, blocked_user_id)
        return await blockedUserModel.findOne({ user_id, blocked_user_id });
    } catch (error) {
        throw new Error('Error isBlockedUser blocked user');
    }
};


module.exports = {
    getAllBlockedUsers,
    isBlockedUser,
    createBlockedUser,
    deleteBlockedUser, 
    getAllBlockUsersByUserId,
    isBlockedUser
    
};