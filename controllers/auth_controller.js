const User = require("../models/user");
const { compare } = require("../public/utils/bcrypt");
const { config } = require("dotenv");
config();

const loginPage = (req, res) => {
  res.render("login", { messages: req.flash("error") });
};

const signupPage = (req, res) => {
  res.render("signup", { messages: req.flash("error") });
};

const login = async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  if (!user) {
    req.flash("error", "هذا المستخدم غير موجود");
    return res.redirect("/login");
  }
  if (!user.isVerified) {
    req.flash(
      "error",
      "هذا المستخدم غير مفعل للتفعيل يرجى الاتصال بفرع نظم جهاز الاستطلاع"
    );
    return res.redirect("/login");
  }
  if (user.lastLogin) {
    const lastLogin = new Date(user.lastLogin).getTime();
    const daysDifference = Math.floor(
      new Date(lastLogin - Date.now()).getTime() / (1000 * 3600 * 24)
    );
    if (daysDifference > 44) {
      user.isVerified = false;
      user.lastLogin = undefined;
      await user.save();
      req.flash(
        "error",
        "تم انتهاء صلاحية تسجيل الدخول لهذا المستخدم لإعادة التفعيل يرجى الاتصال بفرع نظم جهاز الاستطلاع"
      );
      return res.redirect("/login");
    }
  }
  const isMatched = await compare(password, user.password);
  if (!isMatched) {
    req.flash("error", "اسم المستخدم أو كلمة المرور خاطئة");
    return res.redirect("/login");
  }

  if (user.role === "admin") {
    if (
      req.ipAddress !== process.env.ADMIN_IP &&
      process.env.NODE_ENV !== "development"
    ) {
      req.flash("error", "لا يمكن الدخول بهذا المستخدم");
      return res.redirect("/login");
    }
  }
  user.lastLogin = Date.now();
  req.session.user = user;
  if (process.env.NODE_ENV === "development")
    console.log("session:", req.session.user);
  res.redirect("/");
};

const signup = async (req, res) => {
  const { name, password, confirm } = req.body;
  const foundUser = await User.findOne({ name });
  if (foundUser) {
    req.flash("error", "هذا المستخدم موجود بالفعل");
    return res.redirect("/signup");
  }
  if (password.length < 12) {
    req.flash("error", "يجب أن لا تقل كلمة المرور عن 12 حرف");
    return res.redirect("/signup");
  }
  if (password !== confirm) {
    req.flash("error", "من فضلك قم بتأكيد كلمة المرور");
    return res.redirect("/signup");
  }

  const user = new User({ name, password });
  await user.save();

  res.redirect("/login");
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  loginPage,
  login,
  signupPage,
  signup,
  logout,
};
