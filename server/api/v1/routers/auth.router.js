const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const validateRegister = require("../middleware/validate.middleware");
const upload = require("../middleware/upload");

router.post("/register", upload, validateRegister, authController.authRegister);
router.post("/login", authController.authLogin);
router.post("/verifyToken", authController.authVeryToken);
router.post("/forgot-password", authController.authForgotPassword);
router.post("/enter-otp", authController.authEnterOtp);
router.patch("/reset-password", authController.authResetPassword);

module.exports = router;
