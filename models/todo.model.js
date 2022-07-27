const mongoose = require("mongoose");


const todoSchema = new mongoose.Schema(
    {
        userId: { type: Number },
        id: { type: Number },
        title: { type: String, },
        completed: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Todo", todoSchema);
