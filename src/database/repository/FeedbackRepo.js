const { FeedbackModel } = require("../model/FeedbackSchema");

async function create(feedback) {
  const now = new Date();
  feedback.postedAt = feedback.updatedAt = now;
  const postedFeedback = await FeedbackModel.create(feedback);
  return postedFeedback.toObject();
}

async function getAll() {
  return await FeedbackModel.find()
    .select("+postedBy +product +feedback +rating +postedAt +updatedAt")
    .populate({ path: "postedBy", select: "_id name contact email" })
    .populate({ path: "product", select: "_id productName" })
    .lean()
    .exec();
}

async function getRecentFeedback() {
  return await FeedbackModel.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .select("+postedBy +product +feedback +rating +postedAt +updatedAt")
    .populate({ path: "postedBy", select: "_id name contact email" })
    .populate({ path: "product", select: "_id productName" })
    .lean()
    .exec();
}

async function getLimitedFeedback(skip, limit) {
  return await FeedbackModel.find()
    .skip(skip)
    .limit(limit)
    .select("+postedBy +product +feedback +rating +postedAt +updatedAt")
    .populate({ path: "postedBy", select: "_id name contact email" })
    .populate({ path: "product", select: "_id productName" })
    .lean()
    .exec();
}

async function getFeedbackByUser(userId) {
  return await FeedbackModel.find({ postedBy: userId })
    .select("+postedBy +product +feedback +rating +postedAt +updatedAt")
    .populate({ path: "postedBy", select: "_id name contact email" })
    .populate({ path: "product", select: "_id productName" })
    .lean()
    .exec();
}

async function getFeedbackByProduct(productId) {
  return await FeedbackModel.find({ product: productId })
    .select("+postedBy +product +feedback +rating +postedAt +updatedAt")
    .populate({ path: "postedBy", select: "_id name contact email" })
    .populate({ path: "product", select: "_id productName" })
    .lean()
    .exec();
}

async function getByUserAndProduct(userId, productId) {
  return await FeedbackModel.findOne({ postedBy: userId, product: productId })
    .select("+postedBy +product +feedback +rating +postedAt +updatedAt")
    .populate({ path: "postedBy", select: "_id name contact email" })
    .populate({ path: "product", select: "_id productName" })
    .lean()
    .exec();
}

async function getById(feedbackId) {
  return await FeedbackModel.findById(feedbackId)
    .select("+postedBy +product +feedback +rating +postedAt +updatedAt")
    .populate({ path: "postedBy", select: "_id name contact email" })
    .populate({ path: "product", select: "_id productName" })
    .lean()
    .exec();
}

async function deleteById(feedbackId) {
  await FeedbackModel.findByIdAndDelete(feedbackId);
  return { isDeleted: true };
}

async function update(feedback) {
  const now = new Date();
  feedback.updatedAt = now;
  return await FeedbackModel.findByIdAndUpdate(feedback._id, feedback, {
    new: true,
  });
}

module.exports = {
  create,
  getAll,
  getRecentFeedback,
  getLimitedFeedback,
  getFeedbackByUser,
  getById,
  deleteById,
  update,
  getFeedbackByProduct,
  getByUserAndProduct,
};
