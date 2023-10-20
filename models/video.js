const { Schema, model } = require("mongoose");

const VideoSchema = new Schema(
  {
    videoId: {
      type: String,
    },

    title: {
      type: String,
      required: true,
    },

    topic: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    videoUrl: { type: String, required: true },

    viewsCount: {
      type: Number,
      default: 0,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Video", VideoSchema);
