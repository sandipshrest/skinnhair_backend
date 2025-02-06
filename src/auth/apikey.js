const express = require("express");
const { findByKey } = require("../database/repository/ApiKeyRepo");
const { Header } = require("../core/utils");

const router = express.Router();

const apiKey = router.use(async (req, res, next) => {
  try {
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) {
      return res.status(400).json({ error: "API key is required!" });
    }

    const apiKey = await findByKey(key);
    if (!apiKey) {
      return res.status(401).json({ error: "Invalid API key!" });
    }

    req.apiKey = apiKey;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

module.exports = { apiKey };
