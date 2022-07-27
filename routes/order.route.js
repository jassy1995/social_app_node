const express = require("express");
let controller = require("../controllers/order.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", [isAuth, isAdmin], controller.getOrder);
router.post("/", isAuth, controller.createOrder);
router.get("/summary", [isAuth, isAdmin], controller.productSummary);
router.get("/mine", isAuth, controller.getCurrentUserOrder);
router.get("/:id", isAuth, controller.getOrderById);
router.put("/:id/deliver", isAuth, controller.deliverOrder);
router.put("/:id/pay", isAuth, controller.updateOrderById);
router.delete("/:id", [isAuth, isAdmin], controller.deleteOrder);

module.exports = router;
