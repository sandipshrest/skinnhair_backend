const express = require("express");
const ProductRepo = require("../../database/repository/ProductRepo");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

// store the images on disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // uniqueFolderName = generateUniqueFolderName();
    const dir = `./uploads/productImages/sandip2`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    // const splittedArray = file.originalname?.split('.');
    // splittedArray[0] = file.fieldname;
    // const newFilename = splittedArray.join('.');
    cb(null, file.originalname);
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
router.post("/", upload.array("productImages", 6), async (req, res) => {
  // try {
  //   const existingCateogry = await ProductRepo.findByProduct(req.body.product);
  //   if (existingCateogry) {
  //     return res.status(201).json({ message: "Product already added!" });
  //   }

  //   const product = await ProductRepo.create({
  //     ...req.body,
  //   });
  //   res.status(200).json({ message: "Product added successfully!", product });
  // } catch (err) {
  //   console.log(err);
  // }
});

// get all product
router.get("/", async (req, res) => {
  try {
    const allProduct = await ProductRepo.getAll();
    res
      .status(200)
      .json({ message: "Product fetched successfully!", allProduct });
  } catch (err) {
    console.log(err);
  }
});

// get product by id
router.get("/:productId", async (req, res) => {
  try {
    const product = await ProductRepo.getById(req.params.productId);
    res.status(200).json({ message: "Product fetched successfully!", product });
  } catch (err) {
    console.log(err);
  }
});

// delete product by id
router.delete("/:productId", async (req, res) => {
  try {
    const response = await ProductRepo.deleteById(req.params.productId);
    res
      .status(200)
      .json({ message: "Product deleted successfully!", response });
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
    res
      .status(200)
      .json({ message: "Product updated successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
