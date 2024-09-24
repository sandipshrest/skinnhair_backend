const { CategoryModel } = require("../model/CategorySchema");

async function create(category) {
  const now = new Date();
  category.createdAt = category.updatedAt = now;
  const createdCategory = await CategoryModel.create(category);
  return createdCategory.toObject();
}

async function getAll() {
  return await CategoryModel.find()
    .select("+category +createdAt +updatedAt")
    .lean()
    .exec();
}

async function getById(categoryId) {
  return await CategoryModel.findById({_id: categoryId})
    .select("+category +createdAt +updatedAt")
    .lean()
    .exec();
}

async function deleteById(categoryId) {
  await CategoryModel.findByIdAndDelete(categoryId);
  return { deleted: true };
}

async function findByCategory(category) {
  return await CategoryModel.findOne({ category })
    .select("+category +createdAt +updatedAt")
    .lean()
    .exec();
}

async function update(category) {
  const now = new Date();
  category.updatedAt = now;
  return await CategoryModel.findByIdAndUpdate(category._id, category, {
    new: true,
  });
}

module.exports = { create, findByCategory, getAll, getById, deleteById, update };
