const mongoose = require("mongoose");
const User = require("./user.model");


const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    desc: { type: String, max: 500 },
    img: { type: String },
    likes: { type: Array, default: [] },
    img_id: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
