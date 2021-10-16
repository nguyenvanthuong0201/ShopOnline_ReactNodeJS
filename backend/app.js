const express = require('express');
const app = express();

// Phải khai báo để dùng ở dưới 
app.use(express.json())

//router
const product = require('./routers/productRouter');

app.use("/api/v1",product)

module.exports = app ;