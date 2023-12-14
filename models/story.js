const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const StorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imageName: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    body: {
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

    topic: {
      type: String,
      required: true,
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

StorySchema.plugin(uniqueValidator);
module.exports = model("Story", StorySchema);
