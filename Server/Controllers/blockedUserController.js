const blockedUserService = require("../Services/blockedUserService")
const {protect} = require("../Middlewares/autoMiddleware")

const express = require("express");
const router = express.Router();


router.get('/', protect, async(req,res)=>{
    const blockerUsers= await blockedUserService.getAllBlockedUsers()
    return res.status(200).json({message: "groups retrieved successfully", data: blockerUsers})
})

router.get('/isBlock/:userId/:blockedUserId', protect, async(req,res)=>{
    const {userId, blockUserId} = req.body

   
    try{
        console.log(userId, blockUserId)
        const existingBlock= await blockedUserService.isBlockedUser(userId, blockUserId)
        if(existingBlock){
            return res.status(200).json({message: "User is blocked", success: true , data: true})
        }
        else{
            return res.status(200).json({message: "User is not blocking", success: true , data: false})
        }
    }
    catch(error)
    {
        return res.status(500).json({ message: 'Error  isBlocking user' , success: false});
    }
})

// Block a user
router.post('/block', protect,async(req,res)=>{
    const {userId, blockUserId} = req.body

   
    try{
        console.log(userId, blockUserId)
        const existingBlock= await blockedUserService.isBlockedUser(userId, blockUserId)
        if(existingBlock){
            return res.status(400).json({message: "User is already blocked", success: false})
        }

        const block = blockedUserService.createBlockedUser(userId, blockUserId)
        return res.status(200).json({message: "User blocked successfully", success: true})
    }
    catch(error)
    {
        return res.status(500).json({ message: 'Error blocking user' , success: false});
    }
})

// Unblock a user
router.post('/unblock', protect, async(req,res)=>{
    const {userId, blockUserId} = req.body
console.log(req.body)
    try {
        const block = await blockedUserService.deleteBlockedUser(userId,blockUserId)
        if(!block)
        {

            return res.status(400).json({ message: 'Block not found' ,  success: false});
        }
        return res.status(200).json({ message: 'User unblocked successfully' , success: true});
    } 
    catch (error) {
        return res.status(500).json({ message: 'Error unblocking user' , success: false});
    }
        

})

// Get blocked users
router.get('/blocked-users/:userId', protect, async (req, res) => {
    const { userId } = req.params;  // Access it directly from req.params
    console.log(req.params); // Check if userId is being captured correctly
    try {
        const blockedUsers = await blockedUserService.getAllBlockUsersByUserId(userId);
        console.log(blockedUsers)
        return res.status(200).json({
            message: "get all blocked user successfully",
            data: blockedUsers,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching blocked users',
            success: false
        });
    }
});

module.exports = router