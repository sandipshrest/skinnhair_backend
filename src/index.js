require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const Logger = require("./core/Logger");
require('./database') //initialize database connection
// const ApikeyRepo = require("./database/repository/ApikeyRepo");

const app = express();
app.use(express.json());
app.use(express.static("uploads"));
app.use(cors());
app.use("/api", routes);


// Function to generate API key and store it in the database
// const crypto = require("crypto");
const { port } = require("./config");

// function generateApiKey() {
//   return crypto.randomBytes(32).toString("base64"); // Generates a 64-character hex string
// }

// const generatedApiKey = generateApiKey().replace(/=/g, "");
// async function seedApiKey(apiKey, comments) {
//   try {
//     const existingKey = await ApikeyRepo.findByKey(apiKey);
//     if (!existingKey) {
//       await ApikeyRepo.create({
//         key: apiKey, // Store the provided key
//         version: 1, // Example value for version
//         permissions: ["GENERAL"], // Default permissions (adjust as needed)
//         status: true, // Default active status
//         comments: comments,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// const comments = ["To secure the API", "For tracking purposes"];
// seedApiKey(generatedApiKey, comments);

// const { generateKeyPairSync } = require('crypto');
// const { writeFileSync } = require('fs');

// const { privateKey, publicKey } = generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: { type: 'spki', format: 'pem' },
//   privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
// });

// writeFileSync('./keys/private.pem', privateKey);
// writeFileSync('./keys/public.pem', publicKey);

app
  .listen(port, () => {
    Logger.info(`server running on port ${port}`);
  })
  .on("error", (err) => {
    Logger.error(err);
  });
