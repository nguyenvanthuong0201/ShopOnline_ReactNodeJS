const express = require('express');
const app = express();
const cookieParser= require('cookie-parser')

const errorMiddleware = require("./middleware/error")
// Phải khai báo để dùng ở dưới 
app.use(express.json())
app.use(cookieParser())

// import router
const product = require('./routers/productRouter');
const user = require('./routers/userRouter');

app.use("/api/v1",product)
app.use("/api/v1",user)

//middleware for ERROR
app.use(errorMiddleware)

module.exports = app ;