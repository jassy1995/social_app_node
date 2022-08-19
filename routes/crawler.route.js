const express = require("express");
let controller = require("../controllers/crawler.controller");

const router = express.Router();


router.post("/instagram", controller.instagramCrawler);


module.exports = router;
