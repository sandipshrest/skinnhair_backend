const { OrderModel } = require("../model/OrderSchema");

async function create(order) {
  const now = new Date();
  order.createdAt = order.updatedAt = now;
  const createdOrder = await OrderModel.create(order);

  // Populate the references before returning
  const populatedOrder = await OrderModel.findById(createdOrder._id)
    .select(
      "+orderedBy +orderedProduct +quantity +orderStatus +orderId +createdAt +updatedAt"
    )
    .populate({ path: "orderedBy", select: "_id name email contact" })
    .populate({
      path: "orderedProduct",
      select:
        "_id productName description category price discount importedCompany",
    })
    .lean()
    .exec();

  return populatedOrder;
}

async function getAll() {
  return await OrderModel.find()
    .select(
      "+orderedBy +orderedProduct +quantity +orderStatus +orderId +createdAt +updatedAt"
    )
    .populate({ path: "orderedBy", select: "_id name email contact" })
    .populate({
      path: "orderedProduct",
      select:
        "_id productName description category price discount importedCompany",
    })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function getById(orderId) {
  return await OrderModel.findById(orderId)
    .select(
      "+orderedBy +orderedProduct +quantity +orderStatus +orderId +createdAt +updatedAt"
    )
    .populate({ path: "orderedBy", select: "_id name email contact" })
    .populate({
      path: "orderedProduct",
      select:
        "_id productName description category price discount importedCompany",
    })
    .lean()
    .exec();
}

async function deleteById(orderId) {
  await OrderModel.findByIdAndDelete(orderId);
  return { isDeleted: true };
}

async function getByUser(userId) {
  return await OrderModel.find({ orderedBy: userId })
    .select(
      "+orderedBy +orderedProduct +quantity +orderStatus +orderId +createdAt +updatedAt"
    )
    .populate({ path: "orderedBy", select: "_id name email contact" })
    .populate({
      path: "orderedProduct",
      select:
        "_id productName description category price discount importedCompany",
    })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findByProduct(productId, userId) {
  return await OrderModel.findOne({
    orderedProduct: productId,
    orderedBy: userId,
  })
    .select(
      "+orderedBy +orderedProduct +quantity +orderStatus +orderId +createdAt +updatedAt"
    )
    .populate({ path: "orderedBy", select: "_id name email contact" })
    .populate({
      path: "orderedProduct",
      select:
        "_id productName description category price discount importedCompany",
    })
    .lean()
    .exec();
}

async function updateOrdersStatus(orderId, newStatus) {
  const now = new Date();
  await OrderModel.updateMany(
    { orderId }, // filter by orderId
    {
      $set: {
        orderStatus: newStatus.toUpperCase(), // update the status
        updatedAt: now, // update the timestamp
      },
    },
    { new: true }
  );
  return await OrderModel.find({ orderId }).populate({
    path: "orderedBy",
    select: "_id name email",
  }); // fetch all updated orders
}

async function updateById(existingOrder, updatedQuantity) {
  return await OrderModel.findOneAndUpdate(
    { _id: existingOrder },
    { $set: { quantity: updatedQuantity } },
    { new: true }
  )
    .select("+orderedProduct +orderedBy +quantity")
    .lean()
    .exec();
}

module.exports = {
  create,
  getAll,
  getById,
  findByProduct,
  deleteById,
  getByUser,
  updateById,
  updateOrdersStatus,
};
