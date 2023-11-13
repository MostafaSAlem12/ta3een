const Category = require("../models/category");
const moment = require("moment");
moment.locale("ar");
const { config } = require("dotenv");
config();

const searchPage = async (req, res) => {
  const { user } = req.session;
  const limit = 10;
  const page = req.query.page || 1;
  const { q } = req.query;
  if (process.env.NODE_ENV === "development") console.log(typeof q);
  const query = {
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
          {
            type: {
              $regex: q,
              $options: "is",
            },
          },
        ],
      },
    ],
  };
  const categories = await Category.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));
  const count =
    q && q !== ""
      ? await Category.find(query).countDocuments()
      : await Category.countDocuments();
  const pagesCount = Math.ceil(count / limit);
  if (process.env.NODE_ENV === "development") {
    console.log("=".repeat(50));
    console.log(categories);
  }
  res.render("search", {
    categories,
    moment,
    limit,
    page,
    pagesCount,
    count,
    user,
  });
};

module.exports = {
  searchPage,
};
