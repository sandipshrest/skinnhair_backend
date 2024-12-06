const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const schema = new Schema(
  {
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    orderedProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      select: false,
    },
    quantity: {
      type: Schema.Types.Number,
      trim: true,
    },
    price: {
      type: Schema.Types.Number,
      trim: true,
    },
    orderId: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    orderStatus: {
      type: Schema.Types.String,
      default: "PROCESSING",
      select: false,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
      default: new Date(),
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
      default: new Date(),
    },
  },
  {
    versionKey: false,
  }
);

schema.index({ orderedBy: 1, orderedProduct: 1 });

const OrderModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
module.exports = { OrderModel, DOCUMENT_NAME, COLLECTION_NAME };
