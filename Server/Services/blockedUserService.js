const blockedUserRepo = require("../Repositories/blockedUserRepo");

const getAllBlockedUsers=()=>{
    return blockedUserRepo.getAllBlockedUsers()
}

const isBlockedUser = (userId, blockedUserId)=>{
    return blockedUserRepo.isBlockedUser(userId,blockedUserId)
}

// Block a user
const createBlockedUser = (userId, blockedUserId) => {
    return blockedUserRepo.createBlockedUser(userId,blockedUserId)
 };

 const deleteBlockedUser = (userId, blockedUserId)=>{
    return blockedUserRepo.deleteBlockedUser(userId, blockedUserId)
 }

 const getAllBlockUsersByUserId=(userId)=>{
    return blockedUserRepo.getAllBlockUsersByUserId(userId)
}



module.exports = {
    getAllBlockedUsers,
    isBlockedUser,
    createBlockedUser,
    deleteBlockedUser, 
    getAllBlockUsersByUserId
    
};