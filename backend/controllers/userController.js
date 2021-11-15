const ErrorHandler = require("../utils/errorHandler"); // customer lại báo lỗi
const catchAsyncError = require("../middleware/catchAsyncError"); // Báo lỗi nhưng chương trình vẫn tiếp tục run
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")
const cloudinary = require('cloudinary');


// create user 
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user, 201, res);
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

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetTokenUser}`
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetTokenUser}`

    const message = `Your password reset token is : - \n\n ${resetPasswordUrl} \n\n if you have not requested this email then please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password recovery`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

})

//reset password 
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset password Token iss invalid or has been expired ", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password is not password", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined,

        await user.save();
    sendToken(user, 200, res)
})

/// get Details user
exports.getUserDetails = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    res.status(200).json({ success: true, user })
})

/// update password user 
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect ", 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match ", 400))
    }
    user.password = req.body.newPassword
    await user.save()

    sendToken(user, 200, res)
})

/// update user profile (User)
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    if (req.body.avatar !== "") {
        // tìm ID và hủy ảnh nếu không nhập Avatar
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId)

        // Thay thế bằng ảnh khác
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "ECommerce",
            width: 150,
            crop: "scale"
        })
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})

// get all users (Admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
})

// get single user (Admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    res.status(200).json({
        success: true,
        user,
    })
})

/// update user profile (Admin)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "User update successfully"
    })
})
/// update user profile (Admin)
exports.DeleteUserProfile = catchAsyncError(async (req, res, next) => {
    // we will remove cloud later
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User delete successfully"
    })
})

