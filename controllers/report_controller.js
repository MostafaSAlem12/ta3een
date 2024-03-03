const CategoryReport = require("../models/categoryReport");
const Report = require("../models/report");
const moment = require("moment");
moment.locale("ar");
const { config } = require("dotenv");
config();

const getDryReport = async (req, res) => {};

const getReportsPage = async (req, res) => {
  const { user } = req.session;
  const limit = 10;
  const page = req.query.page || 1;
  const { tab } = req.params;
  if (process.env.NODE_ENV === "development") console.log(tab);
  //const {dateStart,dateEnd} = req.query;
  /*const query = {
      date: {
      $gte: new Date(dateStart),
      $lte: new Date(dateEnd)
      }
  }*/
  const q = req.query.q || "";
  const start = req.query.start || "2022-01-01";
  const end = req.query.end || "2026-01-01";
  console.log("hi");
  console.log({ q, start, end });

  // if (q === "") {
  //   query =
  // }

  const query =
    q && q !== ""
      ? +tab === 3
        ? {
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
          }
        : +tab === 2
        ? {
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
              {
                status: {
                  $regex: q,
                  $options: "is",
                },
              },
            ],
          }
        : {
            $and: [
              {
                type:
                  +tab === 0
                    ? "جاف"
                    : +tab === 5
                    ? "مشتروات"
                    : +tab === 4
                    ? "مرتجع"
                    : "طازج",
              },
              {
                date: {
                  $gte: new Date(start),
                  $lte: new Date(end),
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
                    meal: {
                      $regex: q,
                      $options: "is",
                    },
                  },
                ],
              },
            ],
          }
      : +tab < 2 || +tab === 4 || +tab === 5
      ? {
          type:
            +tab === 0
              ? "جاف"
              : +tab === 5
              ? "مشتروات"
              : +tab === 4
              ? "مرتجع"
              : "طازج",
        }
      : {};
  if (process.env.NODE_ENV === "development") console.log(query);
  const currentDate = new Date();
  let reports, count;
  if (+tab === 3) {
    reports = await Report.aggregate([
      { $match: query },
      // {
      //   $group: {
      //     _id: { year: { $year: "$date" }, month: { $month: "$date" } },
      //   },
      // },
      {
        $group: {
          _id: {
            name: "$name",
            type: "$type",
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amountChecked" },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]).exec();
  } else if (+tab === 2) {
    reports = await CategoryReport.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip(limit * (page - 1));
    count =
      q && q !== ""
        ? await CategoryReport.find(query).countDocuments()
        : await CategoryReport.countDocuments();
  } else {
    reports = await Report.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip(limit * (page - 1));
    console.log(reports);
    count =
      q && q !== ""
        ? await Report.find(query).countDocuments()
        : await Report.find(query).countDocuments();
  }
  const pagesCount = Math.ceil(count / limit);
  if (process.env.NODE_ENV === "development") {
    console.log(reports);
    console.log("tab", +tab);
    console.log("pagesCount", pagesCount);
  }
  res.render("report", {
    reports,
    tab: +tab,
    url: "reports",
    moment,
    limit,
    page,
    pagesCount,
    count,
    user,
    q,
    start,
    end,
  });
};

const deleteReport = async (req, res) => {
  const { tab, id } = req.params;
  if (+tab === 2) {
    await CategoryReport.findByIdAndDelete(id);
  } else {
    await Report.findByIdAndDelete(id);
  }
  res.redirect(`/reports/${tab}`);
};

const deleteAll = async (req, res) => {
  await Report.deleteMany();
  res.redirect("/reports/0");
};

module.exports = {
  getReportsPage,
  deleteAll,
  deleteReport,
};
