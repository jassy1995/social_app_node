require("dotenv").config();

module.exports = function (req, res) {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
};
