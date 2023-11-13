const { config } = require("dotenv");
config();
const isSignedIn = (req, res, next) => {
  const user = req.session.user;
  if (process.env.NODE_ENV === "development") console.log("session", user);

  if (!user && req.url !== "/login" && req.url !== "/signup")
    return res.redirect("/login");
  if (user && (req.url === "/login" || req.url === "/signup"))
    return res.redirect("/");

  next();
};

const isNotSignedIn = (req, res, next) => {
  const user = req.session.user;
  if (user) return res.redirect("/");
  next();
};

const isAdmin = (req, res, next) => {
  const role = req.session.user.role;
  console.log(role);
  if (role !== "admin") {
    return res.redirect("/error");
  }
  next();
};

const isUser = (req, res, next) => {
  const role = req.session.user.role;
  if (role !== "user") {
    return res.redirect("/error");
  }
  next();
};

const isAdminAndUser = (req, res, next) => {
  const role = req.session.user.role;
  console.log(role);
  if (role !== "admin" && role !== "user") {
    return res.redirect("/error");
  }
  next();
};

module.exports = { isSignedIn, isAdmin, isUser, isAdminAndUser, isNotSignedIn };
