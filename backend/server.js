const app = require('./app');
const dotenv = require('dotenv');

const connectDatabase = require('./config/database');
// handling uncaught Exception --- báo lỗi khi sai cú pháp hoặc giá trị không tồn tại
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down server due to uncaught Exception ")
    process.exit(1)
})


// config - khai báo env 1 lần để sữ dụng chung cho tất cả các file sau
dotenv.config({path:"backend/config/config.env"})

// connect database mongoDB
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`sever is working on http://localhost:${process.env.PORT}`);
})

// unhandled promise rejection --- báo lỗi promise khi data ko trả về
process.on("unhandledRejection",err=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection")
    server.close(()=>{
        process.exit(1);
    })
})