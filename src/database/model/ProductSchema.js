const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const schema = new Schema(
  {
    productName: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
      required: true,
      select: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      select: false,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
      // maxlength: 200,
      required: true,
      select: false,
    },
    isFeatured: {
      type: Schema.Types.Boolean,
      required: true,
      select: false,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
      select: false,
    },
    discount: {
      type: Schema.Types.Number,
      required: true,
      select: false,
    },
    importedCompany: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
      required: true,
      select: false,
    },
    productImages: {
      type: [Schema.Types.String],
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

// schema.index({ _id: 1 });
schema.index({ productName: 1 });
// schema.index({ description: 1 });

const ProductModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = { ProductModel, DOCUMENT_NAME, COLLECTION_NAME };
