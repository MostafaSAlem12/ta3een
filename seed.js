const mongoose = require("mongoose");
const User = require("./models/user");
const seed = [
  {
    name: "admin",
    password: "admin",
    role: "admin",
    isVerified: true,
  },
  {
    name: "user",
    password: "123456",
    role: "user",
  },
  {
    name: "leader",
    password: "leader",
    role: "leader",
  },
];
mongoose.connect("mongodb://127.0.0.1:27017/ta3een").then(async () => {
  for (let user of seed) {
    const u = new User(user);
    await u.save();
    console.log("User:=============>", u);
  }
  process.exit(0);
});
