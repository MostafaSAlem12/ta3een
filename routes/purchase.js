const express = require("express");
const router = new express.Router();
const { isAdmin, isAdminAndUser } = require("../middlewares/auth");
const {
  index,
  addPage,
  addPurchase,
  editPage,
  editPurchase,
  deletePage,
  deletePurchase,
  buyPage,
  buy,
  editAmountPage,
  editAmount,
  deleteFromList,
} = require("../controllers/purchase_controller");
router.get("/", index);
router.get("/add", isAdmin, addPage);
router.post("/add", isAdmin, addPurchase);
router.get("/edit", isAdmin, editPage);
router.patch("/edit", isAdmin, editPurchase);
router.get("/delete", isAdmin, deletePage);
router.delete("/delete", isAdmin, deletePurchase);
router.get("/buy", isAdminAndUser, buyPage);
router.post("/buy", isAdminAndUser, buy);
router.get("/:id/editAmount", editAmountPage);
router.patch("/:id/editAmount", isAdmin, editAmount);
router.delete("/:id/delete", isAdmin, deleteFromList);
// router.get("/addCheck", addCheckPage);
// router.post("/addCheck", addCheck);

module.exports = router;
