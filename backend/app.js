const express = require('express');
const app = express();
const cookieParser= require('cookie-parser')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const errorMiddleware = require("./middleware/error")
const path = require("path")

// khai bao stripe bên app để thanh toán
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Phải khai báo để dùng ở dưới 
app.use(express.json({limit: '50mb'}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload({useTempFiles: true}))

// import router
const product = require('./routers/productRouter');
const user = require('./routers/userRouter');
const order = require('./routers/orderRouter');
const payment = require('./routers/paymentRouter');

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)

// connect với frontend=> deploy
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

//middleware for ERROR
app.use(errorMiddleware)

module.exports = app ;