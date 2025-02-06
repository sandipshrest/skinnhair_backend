const { ApiKeyModel } = require("../model/ApiKeySchema");

async function create(apikey) {
  const now = new Date();
  apikey.createdAt = apikey.updatedAt = now;
  const createdApiKey = await ApiKeyModel.create(apikey);
  return createdApiKey.toObject();
}

async function findByKey(key) {
  return ApiKeyModel.findOne({ key: key, status: true }).lean().exec();
}

module.exports = {
  create,
  findByKey,
};
