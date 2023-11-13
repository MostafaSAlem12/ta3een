const { config } = require("dotenv");
config();
const IP = require("ip");
const getClientIPAddress = (req, res, next) => {
  const ip = IP.address();
  req.ipAddress = ip;
  if (process.env.NODE_ENV === "development") console.log("ip", req.ipAddress);
  next();
};

module.exports = getClientIPAddress;
