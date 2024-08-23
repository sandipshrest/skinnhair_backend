const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const fs = require("fs");
const crypto = require("crypto");
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
      res
        .status(205)
        .json("Invalid file type. Only JPEG,PNG and WEBP are allowed!"),
      false
    ); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/signup", upload.single("profilePicUrl"), async (req, res) => {
  try {
    const existingUser = await UserRepo.findByEmail(req.body.email);
    if (existingUser) {
      res.status(201).json({ message: "User already registered!" });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await UserRepo.create({
      ...req.body,
      profilePicUrl: req.file?.filename,
      password: passwordHash,
    });
    res
      .status(200)
      .json({ message: "User registered successfully!", user: user });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userDetail = await UserRepo.findByEmail(req.body.email);
    if (!userDetail) {
      res.status(201).json({ message: "User already registered!" });
    }
    const matched = await bcrypt.compare(
      req.body.password,
      userDetail.password
    );
    if (!matched) {
      res.status(201).json({ message: "Password didn't matched!" });
    }
    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    res.status(200).json({
      msg: "Login Successfully",
      accessTokenKey,
      userDetail: {
        ...userDetail,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/user/${userDetail.name.replace(/ /g, "-")}-${userDetail.contact}/${
          userDetail.profilePicUrl
        }`,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
