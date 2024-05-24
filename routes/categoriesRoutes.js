const express = require("express");
const categoriesController = require("./../controllers/categoriesController");

const router = express.Router();

router.get("/load/categories", categoriesController.fetchCategories);

module.exports = router;
