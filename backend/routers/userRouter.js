const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword,
 getUserDetails, updatePassword,updateProfile, getAllUsers,getSingleUser,
 DeleteUserProfile, 
 updateUserRole} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
.delete(isAuthenticatedUser,authorizeRoles("admin"),DeleteUserProfile)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)

module.exports =router; 