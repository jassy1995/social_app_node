const express = require("express");
let controller = require("../controllers/property.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const router = express.Router();

// router.post("/create", controller.createTask);
router.post("/", controller.getPaginatedProperty);
router.get("/orders", [isAuth, isAdmin], controller.getPropertyOrder);
router.get("/option", controller.getOption);
router.get("/:id", controller.getPropertyById);
router.post("/signUp", controller.createAdmin);
router.post("/login", controller.signInAdmin);
router.post("/create-order/:id", controller.createOrder);
router.post("/create-property", controller.createProperty);

module.exports = router;
