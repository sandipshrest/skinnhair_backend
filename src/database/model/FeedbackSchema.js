const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Feedback";
const COLLECTION_NAME = "feedbacks";

const schema = new Schema(
  {
    feedback: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 500,
      required: true,
      select: false,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      select: false,
    },
    rating: {
      type: Schema.Types.Number,
      required: true,
      select: false,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    postedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

schema.index({ _id: 1 });
schema.index({ feedback: 1 });
// schema.index({ description: 1 });

const FeedbackModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = { FeedbackModel, DOCUMENT_NAME, COLLECTION_NAME };
