const ErrorHandle = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong mongodb Id error --không tìm thấy được ID
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path} `;
        err = new ErrorHandle(message, 400)
    }

    // mongoose duplicate key error --Email bị trùng sẽ báo lỗi
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandle(message, 400)
    }

    // wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again `;
        err = new ErrorHandle(message, 400)
    }

    // wrong JWT error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is Expired, try again `;
        err = new ErrorHandle(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        // error:err
        message: err.message
    })
}