var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post("/signup", [
    check("name").isLength({ min: 3 }).withMessage("name should be atleast 3 characters"),
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({ min: 3 }).withMessage("passowrd should be atleast 3 characters long"),
], signup);

router.post("/signin", [
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({ min: 1 }).withMessage("passowrd is required"),
], signin);

router.get("/signout", signout);

module.exports = router;