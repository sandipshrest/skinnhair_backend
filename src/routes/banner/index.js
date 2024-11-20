const express = require("express");
const BannerRepo = require("../../database/repository/BannerRepo");
const { validator } = require("../../helpers/validator");
const schema = require("../access/schema");

const router = express.Router();

// add new banner
router.post("/", validator(schema.banner), async (req, res) => {
  try {
    const existingBanner = await BannerRepo.findByBanner(req.body.banner);
    if (existingBanner) {
      return res.status(201).json({ msg: "Banner already added!" });
    }

    const banner = await BannerRepo.create({
      ...req.body,
    });
    res.status(200).json({ msg: "Banner added successfully!", banner });
  } catch (err) {
    console.log(err);
  }
});

// get all banner
router.get("/", async (req, res) => {
  try {
    const allBanner = await BannerRepo.getAll();
    if (allBanner?.length > 0) {
      return res
        .status(200)
        .json({ msg: "Banner fetched successfully!", allBanner });
    }
    res.status(203).json({ msg: "Fail to fetch banner!" });
  } catch (err) {
    console.log(err);
  }
});

// get banner by id
router.get("/:bannerId", async (req, res) => {
  try {
    const banner = await BannerRepo.getById(req.params.bannerId);
    res.status(200).json({ message: "Banner fetched successfully!", banner });
  } catch (err) {
    console.log(err);
  }
});

// delete banner by id
router.delete("/:bannerId", async (req, res) => {
  try {
    const response = await BannerRepo.deleteById(req.params.bannerId);
    res.status(200).json({ msg: "Banner deleted successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

// update banner
router.patch("/", async (req, res) => {
  try {
    const response = await BannerRepo.update({
      ...req.body,
      _id: req.body.id,
    });
    res.status(200).json({ message: "Banner updated successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
