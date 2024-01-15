const jwt = require("jsonwebtoken");
const { BListModel } = require("../model/blackList");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  const bLlist = await BListModel.findOne({ token });

  if (!bLlist) {
    jwt.verify(token, "masai", (err, decoded) => {
      if (decoded) {
        req.body.userId = decoded.userId;
        req.body.user = decoded.user;
        next();
      } else {
        res.send("UnAuthorized");
      }
    });
  } else {
    res.send("Login First!");
  }
};

module.exports = {
  auth,
};
