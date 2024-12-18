const messageService = require("../Services/meesageServices")
const {protect} = require("../Middlewares/autoMiddleware")

const express = require("express");
const router = express.Router();


router.get("/", protect,async(req,res)=>{

    const messagesAll= messageService.getAllMessage()
    return res.status(200).json({message: "messages retrieved successfully", data: messagesAll})
})

router.post("/",protect,async(req,res)=>{

    const messageData= req.body;
    console.log("messageData: ", messageData)
    if(!messageData)
        {
            console.log("post create message  method not get parmeters")  
            return res.status(400).json({message: "post create message method not get parmeters", success: false}) 
        }
        else{
    
            const status = await messageService.createMessage(messageData)
            if(status.success)
                return res.status(200).json(status)
            else
                return res.status(401).json(status)  
        }
    
})

router.put("/:id",protect,async(req,res)=>{

        const messageData= req.body;
        const id= req.params.id
        if(!messageData || !id)
            {
                console.log("post create message  method not get parmeters")  
                return res.status(400).json({message: "post create message method not get parmeters", success: false}) 
            }
            else{
        
                const status = await messageService.updateMessage(id, messageData)
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
            
                    const status = await messageService.deletedMessage(id)
                    if(status.success)
                        return res.status(200).json(status)
                    else
                        return res.status(401).json(status)  
                }
            
})

router.get("/history/:id", protect,async(req,res)=>{

                const id= req.params.id;
                console.log("history id:", id)
                if(!id)
                    {
                        console.log("s")  
                        return res.status(400).json({message: "", success: false}) 
                    }
                    else{
                
                        const status = await messageService.getMessageHistory(id)
                        if(status.success)
                            return res.status(200).json(status)
                        else
                            return res.status(401).json(status)  
                    }
                
 })
 module.exports = router;