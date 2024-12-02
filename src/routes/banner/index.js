const express = require("express");
const BannerRepo = require("../../database/repository/BannerRepo");
const { validator } = require("../../helpers/validator");
const schema = require("../access/schema");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

const generateUniqueFileName = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8); // Random string
  return `${timestamp}-${randomStr}`;
};

// store the images on disk storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { title, id } = req.body;
    if (id) {
      const existingBanner = await BannerRepo.getById(id);
      if (existingBanner && existingBanner.title !== title) {
        // rename folder name while updating existing product
        const currPath = `./uploads/bannerImages/${existingBanner?.title?.replace(
          /[: ]/g,
          "-"
        )}`;
        const newPath = `./uploads/bannerImages/${title?.replace(
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
      const dir = `./uploads/bannerImages/${title.replace(/[: ]/g, "-")}`;
      fs.exists(dir, (exist) => {
        if (!exist) {
          return fs.mkdir(dir, (error) => cb(error, dir));
        }
        return cb(null, dir);
      });
    }
  },
  filename: async (req, file, cb) => {
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

// add new banner
router.post(
  "/",
  upload.single("bannerImage"),
  validator(schema.banner),
  async (req, res) => {
    try {
      const existingBanner = await BannerRepo.findByBanner(req.body.title);
      if (existingBanner) {
        return res.status(201).json({ msg: "Banner already added!" });
      }

      const banner = await BannerRepo.create({
        ...req.body,
        bannerImage: req.file?.filename,
      });
      res.status(200).json({ msg: "Banner added successfully!", banner });
    } catch (err) {
      console.log(err);
    }
  }
);

// get all banner
router.get("/", async (req, res) => {
  try {
    const banners = await BannerRepo.getAll();
    const formattedBanners = banners.map((banner) => ({
      ...banner,
      bannerImage: `${
        process.env.SERVER_URL
      }/bannerImages/${banner.title.replace(/[: ]/g, "-")}/${
        banner.bannerImage
      }`,
    }));

    if (formattedBanners?.length > 0) {
      return res.status(200).json({
        msg: "Banner fetched successfully!",
        banners: formattedBanners,
      });
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
    const banner = await BannerRepo.getById(req.params.bannerId);
    fs.rm(
      `uploads/bannerImages/${banner?.title?.replace(/[: ]/g, "-")}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log("Folder deleted!");
      }
    );
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
