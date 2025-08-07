const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utlils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
//controller
const userController = require("../controllers/users.js");


//signup for user
router.get("/signup",userController.renderSignupForm );

router.post("/signup", wrapAsync(userController.signup));


//login for user
router.get("/login", userController.renderLoginForm);

//authenticate ka kaam-> jab password, username sahi rhega to /listings me aayega but wrong rhahega to /login me aayega
router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/login", failureFlash: true,
}),    userController.login);

//Logout for user
router.get("/logout",userController.logout);

module.exports = router;