const Category = require("../models/category");
const Report = require("../models/report");
const CategoryReport = require("../models/categoryReport");
const { config } = require("dotenv");
config();

const units = ["جرام", "قطعة", "زجاجة", "علبة", "جردل", "كيس", "عدد"];

const addPage = (req, res) => {
  const { user } = req.session;
  res.render("fresh/add", { user, units, messages: req.flash("error") });
};

const addCategory = async (req, res) => {
  const { name, type, unit, breakFast, lunch, dinner, rate } = req.body;
  const meals = [breakFast, lunch, dinner];
  const c = await Category.findOne({ name });
  if (c) {
    req.flash("error", "هذا الصنف موجود بالفعل");
    return res.redirect("/fresh/add");
  }
  const category = new Category({ name, type, unit, meals, rate });
  await category.save();
  res.redirect("/");
};

const editPage = async (req, res) => {
  const { user } = req.session;
  const categories = await Category.find({ type: "طازج" }).sort({ _id: -1 });
  res.render("fresh/editCategory", { user, categories, units });
};

const editCategory = async (req, res) => {
  try {
    const { name, type, id, newName, unit, breakFast, lunch, dinner, rate } =
      req.body;
    const meals = [breakFast, lunch, dinner];
    const _id = JSON.parse(id)._id;
    await Category.findByIdAndUpdate(_id, {
      name: newName || JSON.parse(id).name,
      unit,
      meals,
      rate,
    });
    res.redirect("/");
  } catch (e) {
    res.redirect("/fresh/edit");
  }
};

const deletePage = async (req, res) => {
  const { user } = req.session;
  const categories = await Category.find({ type: "طازج" }).sort({ _id: -1 });
  res.render("fresh/deleteCategory", { user, categories });
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    await Category.findByIdAndDelete(id);
    res.redirect("/");
  } catch (e) {
    res.redirect("/fresh/delete");
  }
};

const addAmountPage = async (req, res) => {
  const { user } = req.session;
  const categories = await Category.find({ type: "طازج" }).sort({ _id: -1 });
  res.render("fresh/addAmount", { categories, user, units });
};

const addAmount = async (req, res) => {
  const { date, type, categoryItems } = req.body;
  for (let categoryItem of categoryItems) {
    const category = await Category.findOne({ name: categoryItem.name, type });
    if (process.env.NODE_ENV === "development") console.log(category);
    category.amount += +categoryItem.amount;
    await category.save();
    const entryReport = new CategoryReport({
      name: categoryItem.name,
      type,
      amount: categoryItem.amount,
      total: category.amount,
      date,
      status: "دخول",
    });
    await entryReport.save();
  }
  res.redirect("/store/1");
};

const editAmountPage = async (req, res) => {
  const { user } = req.session;
  const { id } = req.params;
  const category = await Category.findById(id);
  res.render("fresh/editAmount", { category, user, units });
};

const editAmount = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  await Category.findByIdAndUpdate(id, { amount });
  res.redirect("/store/1");
};

// const addCheckPage = async (req, res) => {
//   const { user } = req.session;
//   const categories = await Category.find({
//     type: "طازج",
//     amount: {
//       $gt: 0,
//     },
//   }).sort({ _id: -1 });
//   res.render("fresh/addCheck", { categories, user });
// };

// const addCheck = async (req, res) => {
//   const { name, type, amount, amountChecked, meal } = req.body;
//   const parsedName = JSON.parse(name).name;
//   if (process.env.NODE_ENV === "development") console.log("name", parsedName);
//   const category = await Category.findOne({
//     name: parsedName,
//     type,
//   });
//   category.amount -= amountChecked;
//   await category.save();
//   if (process.env.NODE_ENV === "development")
//     console.log("category:", category);
//   const report = new Report({
//     name: parsedName,
//     amountBefore: amount,
//     amountChecked,
//     rest: amount - amountChecked,
//     type: "طازج",
//     meal,
//     date: Date.now(),
//   });
//   await report.save();
//   if (process.env.NODE_ENV === "development") console.log("report:", report);
//   res.redirect("/reports/1");
// };

module.exports = {
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
};
