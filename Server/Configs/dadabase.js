const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/FullStackFinalProj2", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB'))
.catch((error) => console.error('DB connection error:', error));