const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1000 * 60 * 60,
  limit: 1000,
  statusCode: 429,
  skipFailedRequests: true,
  skip: (req, res) => req.url.match(/\/public/),
  requestWasSuccessful: (req, res) => res.statusCode < 400,
  handler: (req, res) => {
    res.status(429).render("429");
  },
});

module.exports = limiter;
