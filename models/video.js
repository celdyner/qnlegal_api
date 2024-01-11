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

    videoUrl: { type: String, required: true },

    videoName: {
      type: String,
      required: true,
    },

    trending: {
      type: String,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    slug: {
      type: String,
      unique: true,
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
