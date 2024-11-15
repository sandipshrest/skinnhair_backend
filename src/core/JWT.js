const path = require("path");
const { readFile } = require("fs");
const { promisify } = require("util");
const { sign, verify } = require("jsonwebtoken");

class JwtPayload {
  aud;
  sub;
  iss;
  iat;
  exp;
  prm;

  constructor(issuer, audience, subject, param, validity) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
    this.prm = param;
  }
}

async function readPublicKey() {
  return promisify(readFile)(
    path.join(__dirname, "../../keys/public.pem"),
    "utf8"
  );
}

async function readPrivateKey() {
  return promisify(readFile)(
    path.join(__dirname, "../../keys/private.pem"),
    "utf8"
  );
}

async function encode(payload) {
  const cert = await readPrivateKey();
  if (!cert)
    throw new Error({ error: "Internal Error: Private key not found" });
  // @ts-ignore
  return promisify(sign)({ ...payload }, cert, { algorithm: "RS256" });
}

/**
 * This method checks the token and returns the decoded data when token is valid in all respect
 */
async function validate(token) {
  const cert = await readPublicKey();
  try {
    // @ts-ignore
    return await promisify(verify)(token, cert);
  } catch (e) {
    if (e && e.name === "TokenExpiredError")
      throw new Error({ error: "Token is Expired" });
    // throws error if the token has not been encrypted by the private key
    throw new Error({ error: "Invalid token" });
  }
}

/**
 * Returns the decoded payload if the signature is valid even if it is expired
 */
async function decode(token) {
  const cert = await readPublicKey();
  try {
    // @ts-ignore
    return await promisify(verify)(token, cert, {
      ignoreExpiration: true,
    });
  } catch (e) {
    throw new Error({ error: "Token is expired" });
  }
}

module.exports = { JwtPayload, encode, validate, decode };
