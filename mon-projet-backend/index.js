const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const sequelize = require("./config/sequelize");

const app = express();
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
