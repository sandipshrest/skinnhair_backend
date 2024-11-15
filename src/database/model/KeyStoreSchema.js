const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Keystore";
const COLLECTION_NAME = "keystores";

const schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    primaryKey: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    secondaryKey: {
      type: Schema.Types.String,
      required: true,
      trim: true,
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

schema.index({ client: 1 });
schema.index({ client: 1, primaryKey: 1, status: 1 });
schema.index({ client: 1, primaryKey: 1, secondaryKey: 1 });

const KeyStoreModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = { KeyStoreModel, DOCUMENT_NAME, COLLECTION_NAME };
