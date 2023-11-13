const bcrypt = require("bcrypt");

const hash = async (password) => {
  // const salt = bcrypt.genSaltSync(10);
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};
const compare = async (password, cipher) => {
  const isMatched = await bcrypt.compare(password, cipher);
  return isMatched;
};

module.exports = {
  hash,
  compare,
};
