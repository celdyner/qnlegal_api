const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", CommentSchema);
