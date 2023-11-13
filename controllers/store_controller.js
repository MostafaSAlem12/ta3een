const Category = require("../models/category");
const moment = require("moment");
moment.locale("ar");
const { config } = require("dotenv");
config();

const getCategoriesPage = async (req, res) => {
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
              type: +tab === 0 ? "جاف" : "طازج",
            },
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
              type: +tab === 0 ? "جاف" : "طازج",
            },
            {
              amount: {
                $gt: 0,
              },
            },
          ],
        };
  if (process.env.NODE_ENV === "development") console.log("query", query);
  const categories = await Category.find(query)
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));
  const count =
    q && q !== ""
      ? await Category.find(query).countDocuments()
      : await Category.find({
          type: +tab === 0 ? "جاف" : "طازج",
          amount: {
            $gt: 0,
          },
        }).countDocuments();
  const pagesCount = Math.ceil(count / limit);
  if (process.env.NODE_ENV === "development") {
    console.log("=".repeat(50));
    console.log(count, " - ", pagesCount);
  }
  res.render("store", {
    categories,
    tab: +tab,
    url: "store",
    moment,
    limit,
    page,
    pagesCount,
    count,
    user,
    q,
  });
};

const deleteCategory = async (req, res) => {
  const { id, tab } = req.params;
  await Category.findByIdAndDelete(id);
  res.redirect(`/store/${tab}`);
};

module.exports = { getCategoriesPage, deleteCategory };
