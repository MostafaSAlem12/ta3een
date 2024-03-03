const express = require("express");
const router = new express.Router();
const Category = require("../models/category");
const { searchPage } = require("../controllers/search_controller");
const { config } = require("dotenv");
config();
router.get("/", async (req, res) => {
  const { user } = req.session;
  const currentDate = new Date();
  const itemsWithExpiry = await Category.find({
    expiry_date: { $exists: true },
  });
  const itemsWithDaysUntilExpiry = itemsWithExpiry.map((item) => {
    const expiryDate = new Date(item.expiry_date);
    const daysUntilExpiry = Math.ceil(
      (expiryDate - currentDate) / (1000 * 60 * 60 * 24)
    );
    return {
      name: item.name,
      daysUntilExpiry,
    };
  });
  console.log(itemsWithExpiry);
  console.log(itemsWithDaysUntilExpiry);
  res.render("index", { user, itemsWithDaysUntilExpiry });
});
router.get("/about", async (req, res) => {
  const { user } = req.session;
  res.render("about", { user });
});

router.get("/search", searchPage);

module.exports = router;
