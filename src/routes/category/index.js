const express = require("express");
const CategoryRepo = require("../../database/repository/CategoryRepo");

const router = express.Router();

// add new category
router.post("/", async (req, res) => {
  try {
    const existingCateogry = await CategoryRepo.findByCategory(
      req.body.category
    );
    if (existingCateogry) {
      return res.status(201).json({ message: "Category already added!" });
    }

    const category = await CategoryRepo.create({
      ...req.body,
    });
    res.status(200).json({ message: "Category added successfully!", category });
  } catch (err) {
    console.log(err);
  }
});

// get all category
router.get("/", async (req, res) => {
  try {
    const allCategory = await CategoryRepo.getAll();
    res
      .status(200)
      .json({ message: "Category fetched successfully!", allCategory });
  } catch (err) {
    console.log(err);
  }
});

// get category by id
router.get("/:categoryId", async (req, res) => {
  try {
    const category = await CategoryRepo.getById(req.params.categoryId);
    res
      .status(200)
      .json({ message: "Category fetched successfully!", category });
  } catch (err) {
    console.log(err);
  }
});

// delete category by id
router.delete("/:categoryId", async (req, res) => {
  try {
    const response = await CategoryRepo.deleteById(req.params.categoryId);
    res
      .status(200)
      .json({ message: "Category deleted successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

// update category
router.patch("/", async (req, res) => {
  try {
    const response = await CategoryRepo.update({
      ...req.body,
      _id: req.body.id,
    });
    res
      .status(200)
      .json({ message: "Category updated successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
