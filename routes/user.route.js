const express = require("express");
let controller = require("../controllers/user.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", [isAuth, isAdmin], controller.getUsers);
router.put("/profile", isAuth, controller.updateUserInfo);
router.put("/follow/:id", isAuth, controller.follow);
router.put("/unfollow/:id", isAuth, controller.unFollow);
router.get("/friends", isAuth, controller.getFriends);
router.get("/:username", [isAuth], controller.getUser);
router.delete("/:id", [isAuth, isAdmin], controller.deleteUser);
module.exports = router;
