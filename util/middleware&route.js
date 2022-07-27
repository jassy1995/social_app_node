require("express-async-errors");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const morgan = require("morgan");
// const path = require("path");
const postRoute = require("../routes/post.route");
const userRoute = require("../routes/user.route");
const authRoute = require("../routes/auth.route");
const orderRoute = require("../routes/order.route");
const taskRoute = require("../routes/task.route");
const propertyRoute = require("../routes/property.route");
const error = require("../middleware/error");
const clientKey = require("../routes/client-key.route");

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
  app.use("/api/keys", clientKey);
  app.use("/api/post", postRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/tasks", taskRoute);
  app.use("/api/properties", propertyRoute);
  app.use("/api/orders", orderRoute);
  app.use(error);
};
