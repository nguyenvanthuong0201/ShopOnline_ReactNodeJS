const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }
    /// convert data từ token ở cookie
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    // decodedData.id của jwt
    req.user = await User.findById(decodedData.id);

    next();
})

exports.authorizeRoles = (...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`role: ${req.user.role} is not allowed to access this resource`,403))
        }
        next();
    }
}