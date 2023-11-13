const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    // name: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    contents: [
      {
        type: [String],
        default: [],
      },
    ],
    type: {
      type: String,
      enum: ["الفطار", "الغداء", "العشاء"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true, versionKey: false }
);

const Meal = mongoose.model("Meal", schema);
module.exports = Meal;
