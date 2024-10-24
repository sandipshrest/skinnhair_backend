const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "api_keys";

const schema = new Schema(
  {
    key: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 1024,
      trim: true,
    },
    version: {
      type: Schema.Types.Number,
      required: true,
      min: 1,
      max: 100,
    },
    permissions: {
      type: [
        {
          type: Schema.Types.String,
          required: true,
          enum: ["GENERAL", "ADMIN", "USER"],
        },
      ],
      required: true,
    },
    comments: {
      type: [
        {
          type: Schema.Types.String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
      ],
      required: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
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

schema.index({ key: 1, status: 1 });

const ApiKeyModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = { ApiKeyModel, DOCUMENT_NAME, COLLECTION_NAME };
