const express = require("express");
const multer = require("multer");
const fs = require("fs");
const UserRepo = require("../../database/repository/UserRepo");

const router = express.Router();
// store the images on disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { name, contact } = req.body;
    const dir = `./uploads/user/${name.replace(/ /g, "-")}-${contact}`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const splittedArray = file.originalname?.split(".");
    splittedArray[0] = file.fieldname;
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
      res.status(205).json(
        "Invalid file type. Only JPEG,PNG and WEBP are allowed!"
      ),
      false
    ); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/", upload.single("profilePicUrl"), async (req, res) => {
  try {
    const existingUser = await UserRepo.findByEmail(req.body.email);
    if (existingUser) {
      res.status(201).json({ message: "User already registered!" });
    }
    const user = await UserRepo.create({
      ...req.body,
      profilePicUrl: req.file?.filename,
    });
    res.status(200).json({ message: "User registered successfully!", user: user });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
