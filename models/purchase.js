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
    type: {
      type: String,
      default: "مشتروات",
    },
    unit: {
      type: String,
      required: true,
      enum: ["جرام", "قطعة", "زجاجة", "علبة", "جردل", "كيس", "عدد"],
      default: "عدد",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    meals: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Purchase = mongoose.model("Purchase", schema);
module.exports = Purchase;
