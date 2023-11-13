const Purchase = require("../models/purchase");
const CategoryReport = require("../models/categoryReport");
const moment = require("moment");
moment.locale("ar");
const { config } = require("dotenv");
config();

const units = ["جرام", "قطعة", "زجاجة", "علبة", "جردل", "كيس", "عدد"];

const index = async (req, res) => {
  const { user } = req.session;
  const limit = 10;
  const page = req.query.page || 1;
  const { tab } = req.params;
  if (process.env.NODE_ENV === "development") console.log(tab);
  const { q } = req.query || "";
  const query =
    q && q !== ""
      ? {
          $and: [
            {
              amount: {
                $gt: 0,
              },
            },
            {
              $or: [
                {
                  name: {
                    $regex: q,
                    $options: "is",
                  },
                },
              ],
            },
          ],
        }
      : {
          $and: [
            {
              amount: {
                $gt: 0,
              },
            },
          ],
        };
  if (process.env.NODE_ENV === "development") console.log("query", query);
  const purchases = await Purchase.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .skip(limit * (page - 1));
  const count =
    q && q !== ""
      ? await Purchase.find(query).countDocuments()
      : await Purchase.find({
          amount: {
            $gt: 0,
          },
        }).countDocuments();
  const pagesCount = Math.ceil(count / limit);
  if (process.env.NODE_ENV === "development") {
    console.log("=".repeat(50));
    console.log(count, " - ", pagesCount);
  }
  res.render("purchases/index", {
    purchases,
    moment,
    limit,
    page,
    pagesCount,
    count,
    user,
    q,
  });
};

const addPage = (req, res) => {
  const { user } = req.session;
  res.render("purchases/add", { user, units, messages: req.flash("error") });
};

const addPurchase = async (req, res) => {
  const { name, breakFast, unit, lunch, dinner, rate } = req.body;
  const meals = [breakFast, lunch, dinner];
  const p = await Purchase.findOne({ name });
  if (p) {
    req.flash("error", "هذا الصنف موجود بالفعل");
    return res.redirect("/purchases/add");
  }
  const purchase = new Purchase({ name, meals, rate, unit });
  await purchase.save();
  res.redirect("/");
};

const editPage = async (req, res) => {
  const { user } = req.session;
  const purchases = await Purchase.find().sort({ _id: -1 });
  res.render("purchases/edit", { user, purchases, units });
};

const editPurchase = async (req, res) => {
  try {
    const { name, id, newName, unit, breakFast, lunch, dinner, rate } =
      req.body;
    const meals = [breakFast, lunch, dinner];
    const result = await Purchase.findByIdAndUpdate(
      JSON.parse(id)._id,
      {
        name: newName || JSON.parse(id).name,
        meals,
        rate,
        unit,
      },
      { new: true }
    );
    res.redirect("/");
  } catch (e) {
    res.redirect("/purchases/edit");
  }
};

const deletePage = async (req, res) => {
  const { user } = req.session;
  const purchases = await Purchase.find().sort({ _id: -1 });
  res.render("purchases/delete", { user, purchases });
};

const deletePurchase = async (req, res) => {
  try {
    const { id } = req.body;
    await Purchase.findByIdAndDelete(id);
    res.redirect("/");
  } catch (e) {
    res.redirect("/purchases/delete");
  }
};

const editAmountPage = async (req, res) => {
  const { user } = req.session;
  const { id } = req.params;
  const purchase = await Purchase.findById(id);
  res.render("purchases/editAmount", { purchase, user });
};

const editAmount = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  await Purchase.findByIdAndUpdate(id, { amount });
  res.redirect("/purchases");
};

const deleteFromList = async (req, res) => {
  const { id } = req.params;
  await Purchase.findByIdAndDelete(id);
  res.redirect(`/purchases`);
};

const buyPage = async (req, res) => {
  const { user } = req.session;
  const purchases = await Purchase.find().sort({ _id: -1 });
  res.render("purchases/buy", { purchases, user });
};

const buy = async (req, res) => {
  const { name, amount, date } = req.body;
  // const purchase = new Purchase(req.body);
  const purchase = await Purchase.findOne({ name });
  purchase.amount += +amount;
  purchase.date = date;
  await purchase.save();
  const entryReport = new CategoryReport({
    name,
    type: "مشتروات",
    amount,
    total: purchase.amount + +amount,
    date,
    status: "دخول",
  });
  await entryReport.save();
  res.redirect("/purchases");
};

module.exports = {
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
};
