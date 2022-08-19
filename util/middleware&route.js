require("express-async-errors");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
// const morgan = require("morgan");
const postRoute = require("../routes/post.route");
const userRoute = require("../routes/user.route");
const authRoute = require("../routes/auth.route");
const conversationRoute = require("../routes/conversation.route");
const messageRoute = require("../routes/message.route");
const crawlerRoute = require("../routes/crawler.route");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(helmet());
  // app.use(morgan("common"));
  app.use(
    fileUpload({
      useTempFiles: true,
    })
  );
  app.use("/api/post", postRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/conversation", conversationRoute);
  app.use("/api/message", messageRoute);
  app.use("/api/crawler", crawlerRoute)
  app.use(error);
};
