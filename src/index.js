require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const Logger = require("./core/Logger");
require('./database') //initialize database connection

const app = express();
app.use(express.json());
app.use(express.static("uploads"));
app.use(cors());
app.use("/api", routes);

const { port } = require("./config");

app
  .listen(port, () => {
    Logger.info(`server running on port ${port}`);
  })
  .on("error", (err) => {
    Logger.error(err);
  });
