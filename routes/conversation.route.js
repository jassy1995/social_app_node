const express = require("express");
let controller = require("../controllers/conversation.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/create", controller.createConversation);
router.get("/find/:firstUserId/:secondUserId", controller.getConversationByIds);
router.get("/:userId", controller.userConversation);


module.exports = router;
