const Category = require("../models/category");
const Report = require("../models/report");
// const CategoryReport = require("../models/categoryReport");
const { config } = require("dotenv");
config();

const addAmountPage = async (req, res) => {
  const { user } = req.session;
  const categories = await Category.find({ type: "جاف" }).sort({ _id: -1 });
  res.render("returned/addAmount", { categories, user });
};

const addAmount = async (req, res) => {
  const { date, type, meal, categoryItems } = req.body;
  let currentItem;
  for (let categoryItem of categoryItems) {
    console.log(categoryItem);
    if (currentItem && categoryItem.name === currentItem) continue;
    const category = await Category.findOne({
      name: categoryItem.name,
      type: "جاف",
    });
    console.log(category);
    const amount = category.amount;

    category.amount += +categoryItem.amount;
    await category.save();
    const report = new Report({
      name: categoryItem.name,
      amountBefore: amount,
      amountChecked: +categoryItem.amount,
      rest: amount + +categoryItem.amount,
      type,
      meal,
      unit: category.unit,
      date,
    });

    await report.save();
    console.log(report);
  }
  res.redirect("/reports/4");
};

module.exports = {
  addAmountPage,
  addAmount,
};
