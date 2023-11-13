const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { hash } = require("../public/utils/bcrypt");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: [12, "كلمة المرور لا تقل عن 12 حرف"],
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
  },
  { timestamps: true, versionKey: false }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password);
  next();
});

// schema.pre("init", function (next) {
//   this.password = hash(this.password);
//   next();
// });

const User = mongoose.model("User", schema);
module.exports = User;
