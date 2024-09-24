const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserRepo = require("../../database/repository/UserRepo");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const existingUser = await UserRepo.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(201).json({ msg: "User already registered!" });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await UserRepo.create({
      ...req.body,
      password: passwordHash,
    });
    res.status(200).json({ msg: "User registered successfully!", user: user });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userDetail = await UserRepo.findByEmail(req.body.email);
    if (!userDetail) {
      return res.status(201).json({ msg: "User already registered!" });
    }
    const matched = await bcrypt.compare(
      req.body.password,
      userDetail.password
    );
    if (!matched) {
      return res.status(201).json({ msg: "Password didn't matched!" });
    }
    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    res.status(200).json({
      msg: "Login Successfully",
      accessTokenKey,
      userDetail,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
