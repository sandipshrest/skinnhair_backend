const express = require("express");
const { validator } = require("../../helpers/validator");
const schema = require("../../routes/access/schema");
const {
  getAccessToken,
  createTokens,
  validateTokenData,
} = require("../../auth/authUtils");
const crypto = require("crypto");
const UserRepo = require("../../database/repository/UserRepo");
const KeyStoreRepo = require("../../database/repository/KeyStoreRepo");
const JWT = require("../../core/JWT");
const { Types } = require("mongoose");

const router = express.Router();

router.post(
  "/refresh",
  validator(schema.auth, "headers"),
  validator(schema.refreshToken),
  async (req, res, next) => {
    try {
      req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

      const accessTokenPayload = await JWT.decode(req.accessToken);
      validateTokenData(accessTokenPayload);

      const user = await UserRepo.findById(
        new Types.ObjectId(accessTokenPayload.sub)
      );
      if (!user) return res.status(401).json({ error: "User not registered" });
      req.user = user;

      const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
      validateTokenData(refreshTokenPayload);

      if (accessTokenPayload.sub !== refreshTokenPayload.sub)
        return res.status(401).json({ error: "Invalid access token" });

      const keystore = await KeyStoreRepo.find(
        req.user,
        accessTokenPayload.prm,
        refreshTokenPayload.prm
      );

      if (!keystore)
        return res.status(401).json({ error: "Invalid access token" });
      await KeyStoreRepo.remove(keystore._id);

      const accessTokenKey = crypto.randomBytes(64).toString("hex");
      const refreshTokenKey = crypto.randomBytes(64).toString("hex");

      await KeyStoreRepo.create(req.user, accessTokenKey, refreshTokenKey);
      const tokens = await createTokens(
        req.user,
        accessTokenKey,
        refreshTokenKey
      );

      return res.status(200).json({
        message: "Token Issued",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
