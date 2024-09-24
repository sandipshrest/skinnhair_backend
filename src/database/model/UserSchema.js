const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
      required: true,
      select: false,
    },
    email: {
      type: Schema.Types.String,
      trim: true,
      unique: true,
      select: false,
    },
    contact: {
      type: Schema.Types.Number,
      unique: true,
      select: false,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      selcet: false,
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
schema.index({ name: 1 });
// schema.index({ description: 1 });

const UserModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = {UserModel, DOCUMENT_NAME, COLLECTION_NAME}

