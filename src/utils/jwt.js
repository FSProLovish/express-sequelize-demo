const jwt = require("jsonwebtoken");

const getJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const verifyJWT = async (token) => {
  const data = jwt.verify(token, process.env.SECRET);
  return data;
};

module.exports = {
  getJWT,
  verifyJWT,
};
