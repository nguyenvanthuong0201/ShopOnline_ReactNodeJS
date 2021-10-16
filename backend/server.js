const app = require('./app');
const dotenv = require('dotenv');

const connectDatabase = require('./config/database')

// config - khai báo env 1 lần để sữ dụng chung cho tất cả các file sau
dotenv.config({path:"backend/config/config.env"})

// connect database mongoDB
connectDatabase();


app.listen(process.env.PORT,()=>{
    console.log(`sever is working on http://localhost:${process.env.PORT}`);

})