const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amountBefore: {
      type: Number,
      default: 0,
    },
    amountChecked: {
      type: Number,
      default: 0,
    },
    rest: {
      type: Number,
      default: 0,
    },
    meal: {
      type: String,
      enum: ["الفطار", "الغداء", "العشاء"],
    },
    unit: {
      type: String,
      required: true,
      enum: ["جرام", "قطعة", "زجاجة", "علبة", "جردل", "كيس", "عدد"],
      default: "عدد",
    },
    type: {
      type: String,
      enum: ["طازج", "جاف", "مشتروات", "مرتجع"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true, versionKey: false }
);

const Report = mongoose.model("Report", schema);
module.exports = Report;
