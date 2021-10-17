const ErrorHandler = require("../utils/errorHandler"); // customer lại báo lỗi
const catchAsyncError = require("../middleware/catchAsyncError"); // Báo lỗi nhưng chương trình vẫn tiếp tục run
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

// create user 
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id ",
            url: "profile URL"
        }
    });
    // goi getJWTToken từ userModel
    sendToken(user, 201, res)
})
// login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email & Password", 400))
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password ", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password ", 401))
    }
    // // goi getJWTToken từ userModel
    // const token = user.getJWTToken();
    // // res.status(201).json({success:true,user}) //trả về data user
    // res.status(201).json({ success: true, token }) // trả về token

    sendToken(user, 200, res)

})
// logout user
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({ success: true, message: "Logged out" })
})

// forgot password;
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found ", 404))
    }

    const resetTokenUser = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetTokenUser}`

    const message = `Your password reset token is : - \n\n ${resetPasswordUrl} \n\n if you have not requested this email then please ignore it`

    try {
        await sendEmail({
            email:user.email,
            subject:`Ecommerce password recovery`,
            message,
        })
        res.status(200).json({
            success: true,
            message:`Email send to ${user.email} successfully`
        })
        
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({ validateBeforeSave: false });
        
        return next(new ErrorHandler(error.message, 500))
    }

})