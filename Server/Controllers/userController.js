const userService = require("../Services/userService")
const {protect} = require("../Middlewares/autoMiddleware")
const express = require("express");
const router = express.Router();

router.get("/", protect, async (c, res) => {
    try {
        const users = await userService.getAllUser();  
        //console.log("users:", users)// Make sure to await this async function
        return res.status(200).json({ message: "Users retrieved successfully", data: users });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve users", success: false, error: error.message });
    }
});

router.get("/:id", protect, async (req, res) => {

    try {
        const id = req.params.id;
        console.log("id:", id)
        const user = await userService.getUserById(id);  
        console.log("user:", user)// Make sure to await this async function
        
        //Deep clone the object and strip out circular references
        const safeUser = JSON.parse(JSON.stringify(user));

        if (user) {
            return res.status(200).json({
                message: "User retrieved successfully",
                data: safeUser  // Send the safe version of the user object
            });
        }
            return res.status(400).json({message: "User exist find"})
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve user", success: false, error: error.message });
    }
});

router.post("/login", async(req,res)=>{
    const {email, password} = req.body

    if(!email || !password)
        return res.status(400).json({ message: "Login failed: email and password are required" });

    const status = await userService.checkUserLogin(email,password)
    if(status.success){
        return res.status(200).json({message: "User Login successfully", data: status})
    }
    else
    return res.status(401).json(status)
})

router.post("/register", async(req,res)=>{
const newUser = req.body

    if(!newUser)
    {
        console.log("post register method not get parmeters")  
        return res.status(400).json({message: "post register method not get parmeters", success: false}) 
    }
    else{
        const status = await userService.createNewUser(newUser)
        if(status.success)
            return res.status(200).json(status)
        else
            return res.status(401).json(status)  
    }

})

router.put("/:id", protect, async(req,res)=>{
    const userData = req.body
    const id = req.params.id;

    if(!userData)
    {
        console.log("put method not get parmeters")  
        return res.status(400).json({message: "put method not get parmeters", success: false}) 
    }
    else{
        const status = await userService.updateUser(id,userData)
        if(status.success)
            return res.status(200).json(status)
        else
            return res.status(401).json(status)  
    }

})

module.exports = router;