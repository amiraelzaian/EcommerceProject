const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
} = require("../controllers/category.controller");
const router = express.Router();

router.route("/").post(createCategory).get(getCategories);
router.route("/:id").get(getCategory);

module.exports = router;
