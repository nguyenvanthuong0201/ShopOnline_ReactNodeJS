const app = require('./app');
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');

// handling uncaught Exception --- báo lỗi khi sai cú pháp hoặc giá trị không tồn tại
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down server due to uncaught Exception ")
    process.exit(1)
})

// config - khai báo env 1 lần để sữ dụng chung cho tất cả các file sau
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

// connect database mongoDB
connectDatabase();

// connect cloudinary --  Chứa hình ảnh 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`sever is working on http://localhost:${process.env.PORT}`);
})

// unhandled promise rejection --- báo lỗi promise khi data ko trả về
process.on("unhandledRejection", err => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection")
    server.close(() => {
        process.exit(1);
    })
})