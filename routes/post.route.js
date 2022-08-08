const express = require("express");
let controller = require("../controllers/post.controller");
const { isAuth, isAdmin } = require("../middleware/auth");


const router = express.Router();

router.post("/create", isAuth, controller.createPost);
router.put("/update/:id", isAuth, controller.updatePost);
router.put("/like-dislike/:id", isAuth, controller.likeDislikePost);
router.delete("/delete/:id", isAuth, controller.deletePost);
router.get("/time-line-post", isAuth, controller.timeLinePost);
router.get("/:id", isAuth, controller.postById);


module.exports = router;
