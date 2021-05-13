const express = require("express");
const router = express.Router();

const {getUserById} = require("../controllers/user")
const {isSignedIn, isAuthenticated } = require("../controllers/auth");
const {getToken, processPayment} = require("../controllers/paymentB");

router.param("userId", getUserById);
router.get("/payment/getToken/:userId", isSignedIn, isAuthenticated, getToken);

router.post("/payment/braintree/:userId", isSignedIn, isAuthenticated, processPayment);

module.exports = router;