const express = require("express");
const router = new express.Router();
const { checkPage, check } = require("../controllers/meal_controller");
router.get("/check", checkPage);
router.post("/check", check);
// router.get("/edit", editPage);
// router.patch("/edit", editPurchase);
// router.get("/delete", deletePage);
// router.delete("/delete", deletePurchase);
// router.get("/buy", buyPage);
// router.post("/buy", buy);
// router.get("/:id/editAmount", editAmountPage);
// router.patch("/:id/editAmount", editAmount);
// router.delete("/:id/delete", deleteFromList);
// router.get("/addCheck", addCheckPage);
// router.post("/addCheck", addCheck);

module.exports = router;
