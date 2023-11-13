const express = require("express");
const router = new express.Router();
const Category = require("../models/category");
const { searchPage } = require("../controllers/search_controller");
const { config } = require("dotenv");
config();
router.get("/", async (req, res) => {
  const { user } = req.session;
  const c = await Category.find();
  if (process.env.NODE_ENV === "development") console.log(c);
  res.render("index", { user });
});
router.get("/about", async (req, res) => {
  const { user } = req.session;
  res.render("about", { user });
});

router.get("/search", searchPage);

module.exports = router;
