const { UserModel } = require("../model/UserSchema");

async function create(user) {
  const now = new Date();
  user.createdAt = user.updatedAt = now;
  const createdUser = await UserModel.create(user);
  return createdUser.toObject()
}
async function findByEmail(email) {
  return await UserModel.findOne({ email })
    .select("+email +name +contact")
    .lean()
    .exec();
}

module.exports = { create, findByEmail };
