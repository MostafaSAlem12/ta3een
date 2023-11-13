const User = require("../models/user");
const moment = require("moment");
moment.locale("ar");

const usersPage = async (req, res) => {
  const { user } = req.session;
  const users = await User.find({
    name: {
      $ne: user.name,
    },
  });
  res.render("users", { users, user, moment });
};

const verify = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.redirect("/users");
  if (user.isVerified) return res.redirect("/users");
  await user.updateOne({ isVerified: true });
  res.redirect("/users");
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.redirect("/users");
};

const userPage = async (req, res) => {
  const { user } = req.session;
  const { id } = req.params;
  const profile = await User.findById(id);
  res.render("user", { profile, user, messages: req.flash("error") });
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;
  const user = await User.findOne({ name });
  if (user) {
    if (user._id != id) {
      req.flash("error", "هذا المستخدم موجود بالفعل");
      return res.redirect(`/users/${id}`);
    }
  }
  await User.findByIdAndUpdate(id, { name, role });
  res.redirect("/users");
};

module.exports = {
  usersPage,
  userPage,
  verify,
  editUser,
  deleteUser,
};
