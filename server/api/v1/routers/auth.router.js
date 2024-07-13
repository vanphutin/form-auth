const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const validateRegister = require("../middleware/validate.middleware");
const upload = require("../middleware/upload");

router.post("/register", upload, validateRegister, authController.authRegister);
router.post("/login", authController.authLogin);

module.exports = router;
