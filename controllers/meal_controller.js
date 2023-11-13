const Category = require("../models/category");
const Purchase = require("../models/purchase");
const Report = require("../models/report");
const Meal = require("../models/meal");
const { config } = require("dotenv");
config();

const checkPage = async (req, res) => {
  const { user } = req.session;
  const categories1 = await Category.find({
    amount: {
      $gt: 0,
    },
  }).sort({ _id: -1 });
  const categories2 = await Purchase.find({
    amount: {
      $gt: 0,
    },
  }).sort({ _id: -1 });
  const categories = [...categories1, ...categories2];
  if (process.env.NODE_ENV === "development") console.log(categories);
  res.render("meals/check", { categories, user });
};

const check = async (req, res) => {
  // console.log(JSON.parse(req.body.categoryItems[0].name).amount);
  const { date, categoryItems, meal } = req.body;
  const contents = [];
  let currentItem;
  for (let categoryItem of categoryItems) {
    const parsedName = JSON.parse(categoryItem.name).name;
    if (currentItem && parsedName === currentItem) continue;
    let category;
    if (JSON.parse(categoryItem.name).type !== "مشتروات") {
      category = await Category.findOne({
        name: parsedName,
      });
    } else {
      category = await Purchase.findOne({
        name: parsedName,
      });
    }

    contents.push(parsedName);

    const type = JSON.parse(categoryItem.name).type;
    const unit = JSON.parse(categoryItem.name).unit;
    category.amount -= categoryItem.amountChecked;
    await category.save();
    if (process.env.NODE_ENV === "development")
      console.log("category:", category);
    const report = new Report({
      name: parsedName,
      amountBefore: categoryItem.amount,
      amountChecked: categoryItem.amountChecked,
      rest: categoryItem.amount - categoryItem.amountChecked,
      type,
      meal,
      unit,
      date,
    });
    await report.save();
    currentItem = parsedName;
    if (process.env.NODE_ENV === "development") console.log("report:", report);
  }
  const newMeal = new Meal({ date, contents, type: meal });
  await newMeal.save();
  res.redirect(`/reports/0`);
};

module.exports = {
  checkPage,
  check,
};
