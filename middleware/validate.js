const PassCheck = (req, res, next) => {
  const { pass } = req.body;

  const hasuppercase = /[A-Z]/.test(pass);
  const hasDigit = /\d/.test(pass);
  const minlength = 8;
  const hasspecialChar = /[!@#$%^&*()_+{}:"?/<>,.]/.test(pass);

  if (
    pass.length < minlength ||
    !hasuppercase ||
    !hasDigit ||
    !hasspecialChar
  ) {
    res.json("Set Strong Password");
  } else {
    next();
  }
};

module.exports = {
  PassCheck,
};
