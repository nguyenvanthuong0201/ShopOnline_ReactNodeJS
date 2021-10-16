const express = require('express');
const app = express();

const errorMiddleware = require("./middleware/error")
// Phải khai báo để dùng ở dưới 
app.use(express.json())

//router
const product = require('./routers/productRouter');

app.use("/api/v1",product)

//middleware for ERROR
app.use(errorMiddleware)

module.exports = app ;