const express = require("express");
const multer = require("multer");
const authRoutes = require("./routes/authRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const authController = require("./controllers/authController");

const app = express();
const form = multer();

app.use(express.json());
app.use(form.array());

app.use("/api/v1/auth", authRoutes);
app.use(authController.protect);

//Protected route
app.use("/api/v1/categorey", categoriesRoutes);
module.exports = app;
