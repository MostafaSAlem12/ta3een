const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["جرام", "قطعة", "زجاجة", "علبة", "جردل", "كيس", "عدد"],
      default: "عدد",
    },
    type: {
      type: String,
      enum: ["طازج", "جاف"],
    },
    meals: {
      type: [String],
      required: true,
    },
    production_date: {
      type: Date,
    },
    expiry_date: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

const Category = mongoose.model("Category", schema);
module.exports = Category;
