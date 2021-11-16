const mongoose = require("mongoose");
const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.on("connected", () => {
        console.log("Connected MongoDB Atlas");
    });
    mongoose.connection.off("error", () => {
        console.log("Don't connect MongoDB Atlas");
    })
};

module.exports = connectDatabase
