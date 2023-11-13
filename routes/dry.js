const express = require("express");
const router = new express.Router();
const { isAdmin, isAdminAndUser } = require("../middlewares/auth");
const {
  addPage,
  addCategory,
  editPage,
  editCategory,
  deletePage,
  deleteCategory,
  addAmountPage,
  addAmount,
  editAmountPage,
  editAmount,
  // addCheckPage,
  // addCheck,
} = require("../controllers/dry_controller");
router.get("/add", isAdmin, addPage);
router.post("/add", isAdmin, addCategory);
router.get("/edit", isAdmin, editPage);
router.patch("/edit", isAdmin, editCategory);
router.get("/delete", isAdmin, deletePage);
router.delete("/delete", isAdmin, deleteCategory);
router.get("/addAmount", isAdminAndUser, addAmountPage);
router.post("/addAmount", isAdminAndUser, addAmount);
router.get("/:id/editAmount", isAdminAndUser, editAmountPage);
router.patch("/:id/editAmount", isAdminAndUser, editAmount);
// router.get("/addCheck", isAdminAndUser, addCheckPage);
// router.post("/addCheck", isAdminAndUser, addCheck);

module.exports = router;
