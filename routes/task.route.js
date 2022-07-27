const express = require("express");
let controller = require("../controllers/task.controller");
const router = express.Router();

router.post("/create", controller.createTask);
router.get("/", controller.getTasks);
router.get("/paginate", controller.getPaginatedTask);
router.get("/:id", controller.getTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
