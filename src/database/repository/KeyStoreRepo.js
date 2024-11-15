const { KeyStoreModel } = require("../model/KeyStoreSchema");

async function findforKey(client, key) {
  return KeyStoreModel.findOne({
    client: client,
    primaryKey: key,
    status: true,
  })
    .lean()
    .exec();
}

async function remove(id) {
  return KeyStoreModel.findByIdAndDelete(id).lean().exec();
}

async function removeAllForClient(client) {
  return KeyStoreModel.deleteMany({ client: client }).exec();
}

async function find(client, primaryKey, secondaryKey) {
  return KeyStoreModel.findOne({
    client: client,
    primaryKey: primaryKey,
    secondaryKey: secondaryKey,
  })
    .lean()
    .exec();
}

async function create(client, primaryKey, secondaryKey) {
  const now = new Date();
  const keystore = await KeyStoreModel.create({
    client: client,
    primaryKey: primaryKey,
    secondaryKey: secondaryKey,
    createdAt: now,
    updatedAt: now,
  });
  return keystore.toObject();
}

module.exports = { findforKey, remove, removeAllForClient, find, create };
