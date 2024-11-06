const { BannerModel } = require("../model/BannerSchema");

async function create(banner) {
  const now = new Date();
  banner.createdAt = banner.updatedAt = now;
  const createdBanner = await BannerModel.create(banner);
  return createdBanner.toObject();
}

async function getAll() {
  return await BannerModel.find()
    .select("+banner +bannerImage +createdAt +updatedAt")
    .lean()
    .exec();
}

async function getById(bannerId) {
  return await BannerModel.findById({ _id: bannerId })
    .select("+banner +bannerImage +createdAt +updatedAt")
    .lean()
    .exec();
}

async function deleteById(bannerId) {
  await BannerModel.findByIdAndDelete(bannerId);
  return { deleted: true };
}

async function findByBanner(banner) {
  return await BannerModel.findOne({ banner })
    .select("+banner +bannerImage +createdAt +updatedAt")
    .lean()
    .exec();
}

async function update(banner) {
  const now = new Date();
  banner.updatedAt = now;
  return await BannerModel.findByIdAndUpdate(banner._id, banner, {
    new: true,
  });
}

module.exports = { create, findByBanner, getAll, getById, deleteById, update };
