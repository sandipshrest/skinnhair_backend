require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const connection = require("./database");
const cors = require("cors");
// const ApikeyRepo = require("./database/repository/ApikeyRepo");

const app = express();
app.use(express.json());
app.use(express.static("uploads"));
app.use(cors());
app.use("/api", routes);

connection();
const port = process.env.PORT;

// Function to generate API key and store it in the database
// const crypto = require("crypto");

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
//         permissions: ["USER"], // Default permissions (adjust as needed)
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

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
