const express = require("express");
const cors = require("cors");
const userController = require("./Controllers/userController");
const messageController = require("./Controllers/messageController");
const groupController = require("./Controllers/groupController");
const blockedUserController = require("./Controllers/blockedUserController")
const config = require("./Configs/dadabase");
const dotenv = require("dotenv");

dotenv.config();  // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;  // Default to 3000 if no env var*/

app.use(express.json());
app.use(cors());

app.use("/users", userController);   
app.use("/groups", groupController);
app.use("/messages", messageController);
app.use("/blockedUser", blockedUserController);

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});