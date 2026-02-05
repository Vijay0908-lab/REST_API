require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = req.get("Authorization").split(" ")[1];
  //Bearer Token.  we expect in this format
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWTKEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
