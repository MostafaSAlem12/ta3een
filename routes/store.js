const express = require("express");
const router = new express.Router();
const {
  getCategoriesPage,
  deleteCategory,
} = require("../controllers/store_controller");
router.get("/:tab", getCategoriesPage);
router.delete("/:tab/:id/delete", deleteCategory);

module.exports = router;
