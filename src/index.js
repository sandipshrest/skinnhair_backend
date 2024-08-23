const express = require("express");
const routes = require("./routes");
const connection = require("./database");
const cors = require("cors");

const app = express();
app.use(express.static('uploads'));
app.use(cors());
app.use("/api", routes);

require("dotenv").config();

connection();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
