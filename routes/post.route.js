const express = require("express");
let controller = require("../controllers/post.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const upload = require("../util/multer");

const router = express.Router();

router.post("/create", isAuth, controller.createPost);
router.put("/update/:id", [isAuth], controller.updatePost);
router.put("/like-dislike/:id", [isAuth], controller.likeDislikePost);
router.delete("/delete/:id", [isAuth], controller.deletePost);
router.get("/time-line-post", isAuth, controller.timeLinePost);
router.get("/todo", controller.getTodo);
router.get("/:id", controller.postById);
// router.get("/", controller.allProduct);
// router.get("/admin", [isAuth, isAdmin], controller.getAdminProduct);
// router.get("/search", controller.filterProduct);
// router.get("/categories", controller.productByCategory);
// router.get("/slug/:slug", controller.productBySlug);

// router.post("/:id/reviews", isAuth, controller.productReview);

module.exports = router;
