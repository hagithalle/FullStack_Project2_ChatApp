const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")
const userModel = require("../Models/userModel")

dotenv.config()// Load environment variables from .env

const protect = async (req, res, next) => {
    let token;
 
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];  // Extract the token part
        } else {
            console.log("Authorization Header:", req.headers.authorization);
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Token expired');
            }
            return res.status(403).send('Failed to authenticate token');
            }
            req.userId = decoded.id; // Or whatever you store in the token
            next();
  });
    } catch (error) {
        console.error("Error in token verification:", error);
        return res.status(401).json({ message: "Not authorized, token expired or invalid" });
    }
};
module.exports = {protect}