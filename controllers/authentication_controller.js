const UserModel = require("./../database/models/user_ model");
const jwt = require("jsonwebtoken");

function loginForm(req, res) {
  res.render("auth/login");

}

async function loginVerify(req, res) {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.redirect("/login");
  }

  const verifyPassword = await user.verifyPassword(password);

  if (!verifyPassword) {
    return res.redirect("/login");
  }

  req.session.user = user;
  res.redirect("/dashboard");
}

function make(req, res) {
  res.render("auth/make");

}

function logout(req, res) {
  // req.session.user = "";
  // res.redirect("/");


  // req.session.destroy(() => {
  //   res.redirect("/");
  // })

  req.logout();
  req.cookie("jwt", null, { maxAge: -1 });
  res.redirect("/");

}
async function create(req, res, next) {
  //res.send(req.body);
  const user = await UserModel.create(req.body);

  req.login(user, (err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/dashboard");
  })


}

function generateJWT(req, res) {
  const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
  res.cookie("jwt", token);
  res.redirect("/dashboard");
}

module.exports = {
  loginForm,
  loginVerify,
  make,
  create,
  logout,
  generateJWT

}