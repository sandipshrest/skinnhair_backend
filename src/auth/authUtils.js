const { JwtPayload, encode } = require("../core/JWT");
const { Types } = require("mongoose");
const { tokenInfo } = require("../config");

const getAccessToken = (authorization) => {
  if (!authorization)
    return res.status(401).json({ error: "Invalid Authorization" });
  if (!authorization.startsWith("Bearer "))
    return res.status(401).json({ error: "Invalid Authorization" });
  return authorization.split(" ")[1];
};

const validateTokenData = (payload) => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience ||
    !Types.ObjectId.isValid(payload.sub)
  )
    return res.status(401).json({ error: "Invalid Access token!" });
  return true;
};

const createTokens = async (user, accessTokenKey, refreshTokenKey) => {
  const accessToken = await encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      accessTokenKey,
      tokenInfo.accessTokenValidity
    )
  );

  if (!accessToken) return res.status(500).json({ error: "Internal Error" });

  const refreshToken = await encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      refreshTokenKey,
      tokenInfo.refreshTokenValidity
    )
  );

  if (!refreshToken) return res.status(500).json({ error: "Internal Error" });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

module.exports = { getAccessToken, validateTokenData, createTokens };