const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserRepo = require("../../database/repository/UserRepo");
const { create, remove } = require("../../database/repository/KeyStoreRepo");
const { validator } = require("../../helpers/validator");
const schema = require("../access/schema");
const { createTokens } = require("../../auth/authUtils");
const authentication = require("../../auth/authentication");

const router = express.Router();

router.post("/signup", validator(schema.signup), async (req, res) => {
  try {
    const existingUser = await UserRepo.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(201).json({ msg: "User already registered!" });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await UserRepo.create({
      ...req.body,
      password: passwordHash,
      role: "USER",
    });
    res.status(200).json({ msg: "User registered successfully!", user: user });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", validator(schema.credential), async (req, res) => {
  try {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) {
      return res.status(201).json({ msg: "User not registered!" });
    }
    const matched = await bcrypt.compare(req.body.password, user.password);
    if (!matched) {
      return res.status(201).json({ msg: "Password didn't matched!" });
    }
    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

    res.status(200).json({
      msg: "Login Successfully",
      tokens,
      user,
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/logout", authentication, async (req, res) => {
  try {
    await remove(req.keystore?._id);
    return res.status(200).send({ msg: "Logout successfully!" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
