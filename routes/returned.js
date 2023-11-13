const express = require("express");
const router = new express.Router();
const { isAdmin, isAdminAndUser } = require("../middlewares/auth");
const {
  addAmountPage,
  addAmount,
} = require("../controllers/returned_controller");
router.get("/addAmount", isAdminAndUser, addAmountPage);
router.post("/addAmount", isAdminAndUser, addAmount);

module.exports = router;
