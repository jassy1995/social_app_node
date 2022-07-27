const express = require("express");
let controller = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", controller.createUser);
router.post("/login", controller.loginUser);

module.exports = router;
