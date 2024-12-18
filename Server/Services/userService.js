const userRepo = require("../Repositories/userRepo")
const jwt= require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv= require("dotenv")

const saltRounds = 10;
dotenv.config(); // Load environment variables from .env

const getAllUser= ()=>{
    return userRepo.getAllUser()
}

const getUserById = (id) => {
    return userRepo.getUserById(id);
};



const checkUserLogin=async(email, password)=>{
   try{
        const user = await userRepo.getUserByEmail(email)
        if(!user)
        {
            return {message: "Login failed: Email not found", success: false}
        }
        //Check passwor is valid
        const isPasswordValid= await bcrypt.compare(password, user.password)
        if(!isPasswordValid)
        {
            return {message: "Login failed: Incorrect password", success: false}
        }

        const token = generateToken(user)
        return {user, token, success: true}
   }
   catch(err){
    console.error("Error generating token:", err);
        return { message: "Login failed: Error generating token" , success: false};
   }
}

const createNewUser=async(user)=>{
   try{
    console.log("createNewUser:", user)
    // Check if user already exists
    const existingUser = await userRepo.getUserByEmail(user.email)
    if(existingUser)
    {
        return {message: "user is already exists", success: false}
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    console.log("createNewUser:", user)
    await userRepo.createNewUser(user)
     return {message: "User created successfully", success: true}
   }
   catch(err){
    return {message:`Error when creating new user: ${err}`, success: false}
   }
  
}

const updateUser=async(id, userData)=>{
    try{

        if(userData.password){
            userData.password = await bcrypt.hash(userData.password, saltRounds)
        }
        else{
            delete userData.password
        }

        const updateUser= await userRepo.updateUser(id,userData)
        if(!updateUser){
            return {message:"Updated failed: User not found...", success: false}
        }
         return {message:"User updated successfully", success: true, updateUser}
       }
       catch(err){
        return {message:`Update user was err: ${err}`, success: false}
       }
}

function generateToken(user) {
    console.log("generateToken:", user)
    try {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return token;
    } catch (error) {
        throw new Error("Error generating token: ", error);
    }
  }

module.exports = {getAllUser,getUserById, checkUserLogin, createNewUser, updateUser}