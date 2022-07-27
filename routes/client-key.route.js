const express = require("express");
let controller = require("../controllers/clientKey.controller");
const { isAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/google", isAuth, controller.googleApi);
router.get("/paypal", isAuth, controller.paymentApi);

module.exports = router;
