require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const sequelize = db.sequelize || db;

require("./models/User");
require("./models/Project");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (sequelize && typeof sequelize.sync === "function") {
      await sequelize.sync({ alter: true });
      console.log("Database synchronized successfully");
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

startServer();

