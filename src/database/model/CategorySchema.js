const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "categories";

const schema = new Schema(
  {
    category: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
      required: true,
      select: false,
    },
    createdAt: {
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
schema.index({ category: 1 });
// schema.index({ description: 1 });

const CategoryModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = { CategoryModel, DOCUMENT_NAME, COLLECTION_NAME };
