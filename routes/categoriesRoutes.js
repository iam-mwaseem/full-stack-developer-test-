const express = require("express");
const categoriesController = require("./../controllers/categoriesController");

const router = express.Router();

router.get("/load_categories", categoriesController.fetchCategories);

module.exports = router;
