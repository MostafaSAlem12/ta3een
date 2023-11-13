const express = require("express");
const router = new express.Router();
const {
  loginPage,
  signupPage,
  signup,
  login,
  logout,
} = require("../controllers/auth_controller");
router.get("/login", loginPage);
router.get("/signup", signupPage);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
