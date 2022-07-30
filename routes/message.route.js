const express = require("express");
let controller = require("../controllers/message.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/create", controller.createMessage);
router.get("/:conversationId", controller.getMessage);



module.exports = router;
