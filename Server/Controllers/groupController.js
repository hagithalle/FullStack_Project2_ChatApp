const groupService = require("../Services/groupService")
const {protect} = require("../Middlewares/autoMiddleware")

const express = require("express");
const router = express.Router();


router.get("/",protect, async(req,res)=>{
    const groups= await groupService.getAllGroup()
    return res.status(200).json({message: "groups retrieved successfully", data: groups})
})

router.get("/:id",protect, async(req,res)=>{
    const id= req.params.id

    const group= await groupService.getGroupById(id)
    return res.status(200).json({message: "group retrieved successfully", data: group})
})


// Route to fetch all groups a user belongs to
router.get('/myGroup/:id', protect, async (req, res) => {
    try {
        const userId = req.params.id;

        // Find groups that contain the userId in the users_id array
        const groups = await groupService.getGroupsByUserId(userId);
        return res.status(200).json({
            message: "Groups retrieved successfully",
            data: groups,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
});

router.post("/", protect, async(req,res)=>{

    const groupData= req.body;
    if(!groupData)
        {
            console.log("post create group  method not get parmeters")  
            return res.status(400).json({message: "post create group method not get parmeters", success: false}) 
        }
        else{
    
            const status = await groupService.createGroup(groupData)
            if(status.success)
                return res.status(200).json(status)
            else
                return res.status(401).json(status)  
        }
    })

router.put("/:id/:userId",protect, async(req,res)=>{
        const groupId= req.params.id
        const userId= req.params.userId
        if(!groupId || !userId)
            {
                console.log("post add user to group method not get parmeters")  
                return res.status(400).json({message: "post add user to group method not get parmeters", success: false}) 
            }
            else{

                const status = await groupService.addUserToGroup(groupId, userId)
                if(status.success)
                    return res.status(200).json(status)
                else
                    return res.status(401).json(status)  
            }
})

//update group
router.put("/:id",protect, async(req,res)=>{
    const groupId= req.params.id
    const groupData= req.body
    if(!groupData || !groupId)
        {
            console.log("post update group method not get parmeters")  
            return res.status(400).json({message: "put update group method not get parmeters", success: false}) 
        }
        else{

            const status = await groupService.updateGroup(groupId, groupData)
            if(status.success)
                return res.status(200).json(status)
            else
                return res.status(401).json(status)  
        }
})

router.delete("/:id/:userId",protect, async(req,res)=>{
    const groupId= req.params.id
    const userId= req.params.userId
    if(!groupId || !userId)
        {
            console.log("post remove user to group method not get parmeters")  
            return res.status(400).json({message: "post remove user to group method not get parmeters", success: false}) 
        }
        else{

            const status = await groupService.removeUserFromGroup(groupId, userId)
            if(status.success)
                return res.status(200).json(status)
            else
                return res.status(401).json(status)  
        }
    })

    router.delete("/:id",protect,async(req,res)=>{

        const id= req.params.id;
        if(!id)
            {
                console.log("deleted message  method not get parmeters")  
                return res.status(400).json({message: "deleted message method not get parmeters", success: false}) 
            }
            else{
        
                const status = await groupService.deletedGroup(id)
                if(status.success)
                    return res.status(200).json(status)
                else
                    return res.status(401).json(status)  
            }
        
})

module.exports = router
