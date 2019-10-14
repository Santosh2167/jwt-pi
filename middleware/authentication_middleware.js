function authorize(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};

function check_user(req, res, next) {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = {
  authorize,
  check_user
}