const { ProductModel } = require("../model/ProductSchema");

const CATEGORY_DETAIL = "_id category";

async function create(product) {
  const now = new Date();
  product.createdAt = product.updatedAt = now;
  const createdProduct = await ProductModel.create(product);
  return createdProduct.toObject();
}

async function getAll() {
  return await ProductModel.find()
    .select(
      "+productName +category +createdAt +updatedAt +productImages +price +discount +importedCompany +isFeatured +description"
    )
    .populate("category", CATEGORY_DETAIL)
    .lean()
    .exec();
}

async function getLimitedProduct(skip, limit) {
  return await ProductModel.find()
    .skip(skip)
    .limit(limit)
    .select(
      "+productName +category +createdAt +updatedAt +productImages +price +discount +importedCompany +isFeatured +description"
    )
    .populate("category", CATEGORY_DETAIL)
    .lean()
    .exec();
}

async function getById(productId) {
  return await ProductModel.findById({ _id: productId })
    .select(
      "+productName +category +createdAt +updatedAt +productImages +price +discount +importedCompany +isFeatured +description"
    )
    .populate("category", CATEGORY_DETAIL)
    .lean()
    .exec();
}

async function deleteById(productId) {
  await ProductModel.findByIdAndDelete(productId);
  return { deleted: true };
}

async function findByProduct(product) {
  return await ProductModel.findOne({ product })
    .select("+productName +category +createdAt +updatedAt")
    .populate({ path: "category", select: CATEGORY_DETAIL })
    .lean()
    .exec();
}

async function update(product) {
  const now = new Date();
  product.updatedAt = now;
  return await ProductModel.findByIdAndUpdate(product._id, product, {
    new: true,
  });
}

module.exports = {
  create,
  findByProduct,
  getAll,
  getLimitedProduct,
  getById,
  deleteById,
  update,
};
