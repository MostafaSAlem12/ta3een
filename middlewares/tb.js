const tb = (req, res, next) => {
  const now = Date.now();
  const date = new Date("2023-12-1").getTime();
  if (now > date) return res.render("404");
  next();
};

module.exports = tb;
