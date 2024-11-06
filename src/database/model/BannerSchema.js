const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Banner";
const COLLECTION_NAME = "banners";

const schema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
      required: true,
      select: false,
    },
    bannerImage: {
      type: Schema.Types.String,
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
schema.index({ banner: 1 });
// schema.index({ description: 1 });

const BannerModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = { BannerModel, DOCUMENT_NAME, COLLECTION_NAME };
