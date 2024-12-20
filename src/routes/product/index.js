const express = require("express");
const ProductRepo = require("../../database/repository/ProductRepo");
const CategoryRepo = require("../../database/repository/CategoryRepo");
const multer = require("multer");
const fs = require("fs");
const { validator } = require("../../helpers/validator");
const schema = require("../access/schema");
const { FeedbackModel } = require("../../database/model/FeedbackSchema");
const { default: mongoose } = require("mongoose");

const router = express.Router();

const generateUniqueFileName = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8); // Random string
  return `${timestamp}-${randomStr}`;
};

// store the images on disk storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { productName, id } = req.body;
    if (id) {
      const existingProduct = await ProductRepo.getById(id);
      if (existingProduct && existingProduct.productName !== productName) {
        // rename folder name while updating existing product
        const currPath = `./uploads/productImages/${existingProduct?.productName?.replace(
          /[: ]/g,
          "-"
        )}`;
        const newPath = `./uploads/productImages/${productName?.replace(
          /[: ]/g,
          "-"
        )}`;

        return fs.rename(currPath, newPath, function (err) {
          if (err) {
            console.log(err);
            cb(err, "Failed to rename directory");
          } else {
            console.log("Successfully renamed the directory.");
            cb(null, newPath);
          }
        });
      }
    } else {
      // create new folder while adding new product
      const dir = `./uploads/productImages/${productName.replace(
        /[: ]/g,
        "-"
      )}`;
      fs.exists(dir, (exist) => {
        if (!exist) {
          return fs.mkdir(dir, (error) => cb(error, dir));
        }
        return cb(null, dir);
      });
    }
  },
  filename: async (req, file, cb) => {
    // const { productName, id } = req.body;
    // const existingProduct = await ProductRepo.getById(id);
    // // delete existing image while updating the product
    // if (existingProduct && file) {
    //   const filePath = `./uploads/productImages/${name?.replace(
    //     /[: ]/g,
    //     "-"
    //   )}-${defac}/${existingMenu?.menuUrl}`;
    //   fs.unlinkSync(filePath);
    // }
    const uniqueFileName = generateUniqueFileName();
    const splittedArray = file.originalname?.split(".");
    splittedArray[0] = uniqueFileName;
    const newFilename = splittedArray.join(".");
    cb(null, newFilename);
  },
});

// accept if it's similar to filetype else rejct the file
const fileFilter = (req, file, cb) => {
  // Regex to match file extensions (e.g., .jpeg, .jpg, .png)
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(file.originalname.toLowerCase());

  if (extname) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only JPEG,PNG and WEBP are allowed!"),
      false
    ); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// add new product
router.post(
  "/",
  upload.array("productImages", 6),
  validator(schema.product),
  async (req, res) => {
    try {
      const existingProduct = await ProductRepo.findByProduct(
        req.body.productName
      );
      if (existingProduct) {
        return res.status(201).json({ msg: "Product already added!" });
      }
      const product = await ProductRepo.create({
        ...req.body,
        productImages: req.files.map((file) => file.filename),
      });
      return res
        .status(200)
        .json({ msg: "Product added successfully!", product });
    } catch (err) {
      console.log(err);
    }
  }
);

// get all product
router.get("/", async (req, res) => {
  try {
    let allProduct = [];
    const totalProduct = (await ProductRepo.getAll()).length;

    // check if page is not provided then fetch all product else fetch limited product
    if (!req.query.page) {
      allProduct = await ProductRepo.getAll();
    } else {
      const limit = req.query.pageSize || 10;
      const skip = (req.query.page - 1) * limit;
      allProduct = await ProductRepo.getLimitedProduct(skip, limit);
    }

    // format the product image path
    const formattedProduct = await formatProducts(allProduct);

    // send the response
    return res.status(200).json({
      message: "Product fetched successfully!",
      totalProduct: totalProduct,
      productList: formattedProduct,
    });
  } catch (err) {
    console.log(err);
  }
});

// get featured product
router.get("/featured", async (req, res) => {
  try {
    const featuredProduct = await ProductRepo.getFeaturedProduct();

    // format the product image path
    const formattedProduct = await formatProducts(featuredProduct);

    // send the response
    return res.status(200).json({
      message: "Product fetched successfully!",
      featuredProduct: formattedProduct,
    });
  } catch (err) {
    console.log(err);
  }
});

// get product by category
router.get("/category", async (req, res) => {
  try {
    const { category } = req.query;
    const categoryData = await CategoryRepo.findByCategory(category);
    const productByCategory = await ProductRepo.getProductByCategory(
      categoryData?._id
    );

    // format the product image path
    const formattedProduct = await formatProducts(productByCategory);

    // send the response
    return res.status(200).json({
      message: "Product fetched successfully!",
      productList: formattedProduct,
    });
  } catch (err) {
    console.log(err);
  }
});

// get searched product
router.get("/search", async (req, res) => {
  try {
    const { searchedText } = req.query;
    const searchedProduct = await ProductRepo.getSearchedProducts(searchedText);

    // format the product image path
    const formattedProduct = await formatProducts(searchedProduct);

    return res.status(200).json({
      message: "Product fetched successfully!",
      searchedProduct: formattedProduct,
    });
  } catch (err) {
    console.log(err);
  }
});

// get product by id
router.get("/:productId", async (req, res) => {
  try {
    const product = await ProductRepo.getById(req.params.productId);

    const aggregateRating = await FeedbackModel.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(product._id) } },
      { $group: { _id: "$product", avgRating: { $avg: "$rating" } } },
    ]);

    const newRating = aggregateRating[0]?.avgRating || 0;

    // calculate total rating count
    const totalReview = await FeedbackModel.find({ product: product._id });

    return res.status(200).json({
      message: "Product fetched successfully!",
      product: {
        ...product,
        productImages: product.productImages.map(
          (image) =>
            `${
              process.env.SERVER_URL
            }/productImages/${product.productName.replace(
              /[: ]/g,
              "-"
            )}/${image}`
        ),
        rating: newRating,
        totalReview: totalReview.length,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// delete product by id
router.delete("/:productId", async (req, res) => {
  try {
    const product = await ProductRepo.getById(req.params.productId);
    fs.rm(
      `uploads/productImages/${product?.productName?.replace(/[: ]/g, "-")}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log("Folder deleted!");
      }
    );
    const response = await ProductRepo.deleteById(req.params.productId);
    return res
      .status(200)
      .json({ msg: "Product deleted successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

router.patch("/featured/:productId", async (req, res) => {
  try {
    const response = await ProductRepo.updateFeatured(
      req.params.productId,
      req.body.isFeatured
    );
    return res
      .status(200)
      .json({ msg: "Product updated successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

// update product
router.patch("/", async (req, res) => {
  try {
    const response = await ProductRepo.update({
      ...req.body,
      _id: req.body.id,
    });
    return res
      .status(200)
      .json({ msg: "Product updated successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

//format the product image path
const formatProducts = (products) => {
  return Promise.all(
    products.map(async (product) => {
      // calculate  average rating
      const aggregateRating = await FeedbackModel.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(product._id) } },
        { $group: { _id: "$product", avgRating: { $avg: "$rating" } } },
      ]);

      const newRating = aggregateRating[0]?.avgRating || 0;

      // calculate total rating count
      const totalReview = await FeedbackModel.find({ product: product._id });
      return {
        ...product,
        productImages: product.productImages.map(
          (image) =>
            `${
              process.env.SERVER_URL
            }/productImages/${product.productName.replace(
              /[: ]/g,
              "-"
            )}/${image}`
        ),
        rating: newRating,
        totalReview: totalReview.length,
      };
    })
  );
};

module.exports = router;
