const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require("express-jwt");
const { result } = require("lodash");

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user in db"
            })
        }

        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
}

exports.signin = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User email does not exist"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password does not match"
            })
        }

        // create token
        var token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // put token into cookie
        res.cookie("token", token, { expire: new Date() + 99999 });

        // send response to frontend
        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: {
                _id, name, email, role
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token");
    return res.json({
        message: "Sigout Completed"
    });
}

// Protected Routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})

// Custom MiddleWare
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    console.log(req.profile);
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }

    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "you are not Admin"
        })
    }
    next();
}