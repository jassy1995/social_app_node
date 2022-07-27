require("dotenv").config();
exports.googleApi = function (req, res) {
  return res.send({ key: process.env.GOOGLE_API_KEY || "" });
};

exports.paymentApi = function (req, res) {
  return res.send(process.env.PAYPAL_CLIENT_ID || "sb");
};
