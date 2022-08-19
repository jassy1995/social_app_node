const mongoose = require("mongoose");


const photoSchema = new mongoose.Schema(
  {
    albumId: {
      type:Number,
    },
    id: { type: Number},
    title: { type: String },
    url: { type: String},
    thumbnailUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Photo", photoSchema);


