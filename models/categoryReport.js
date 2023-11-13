const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["طازج", "جاف", "مشتروات"],
    },
    amount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["دخول", "خروج"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true, versionKey: false }
);

const CategoryReport = mongoose.model("CategoryReport", schema);
module.exports = CategoryReport;
