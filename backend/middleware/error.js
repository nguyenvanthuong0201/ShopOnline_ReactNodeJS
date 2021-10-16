const ErrorHandle = require("../utils/errorHandler")

module.exports=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message ||"Internal Server Error";

    // wrong mongodb Id error --- không tìm thấy được ID
    if(err.name ==="CastError"){
        const message = `Resource not found. Invalid: ${err.path} `;
        err = new ErrorHandle(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        // error:err
        message:err.message
    })
}