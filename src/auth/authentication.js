const express = require("express");
const JWT = require("../core/JWT");
const { getAccessToken, validateTokenData } = require("./authUtils");
const { validator } = require("../helpers/validator");
const schema = require("./schema");
const { findforKey } = require("../database/repository/KeyStoreRepo");
const { findById } = require("../database/repository/UserRepo");
const { Types } = require("mongoose");

const router = express.Router();

const authentication = router.use(
  validator(schema.auth, "headers"),
  async (req, res, next) => {
    try {
      req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const user = await findById(new Types.ObjectId(payload.sub));
      if (!user) return res.status(400).json("User not registered");
      req.user = user;

      const keystore = await findforKey(req.user, payload.prm);
      if (!keystore) return res.status(400).json("Invalid access token");
      req.keystore = keystore;

      return next();
    } catch (err) {
      throw err;
    }
  }
);

module.exports = authentication;
