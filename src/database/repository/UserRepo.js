const { UserModel } = require("../model/UserSchema");

async function create(user) {
  const now = new Date();
  user.createdAt = user.updatedAt = now;
  const createdUser = await UserModel.create(user);
  return createdUser.toObject();
}

async function findByEmail(email) {
  return await UserModel.findOne({ email })
    .select("+email +name +contact +role +password")
    .lean()
    .exec();
}

async function findById(id) {
  return await UserModel.findById(id)
    .select("+email +name +contact +role +password")
    .lean()
    .exec();
}

async function findAll() {
  return await UserModel.find({ role: "USER" })
    .select("+email +name +contact +role")
    .lean()
    .exec();
}

async function remove(id) {
  return await UserModel.findByIdAndDelete(id).lean().exec();
}

module.exports = { create, findByEmail, findById, findAll, remove };
