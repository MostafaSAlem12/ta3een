const express = require("express");
const router = new express.Router();
const {
  usersPage,
  verify,
  deleteUser,
  userPage,
  editUser,
} = require("../controllers/users_controller");
router.get("/", usersPage);
router.get("/:id", userPage);
router.patch("/:id/edit", editUser);
router.post("/:id/verify", verify);
router.delete("/:id/delete", deleteUser);

module.exports = router;
