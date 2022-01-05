const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./config.json");
const routes = require("./routes");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(config.db.uri, config.db.options).catch((e) => {
  console.error("DB connection error", e.message);
});
