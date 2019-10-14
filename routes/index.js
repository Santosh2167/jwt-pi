const express = require("express");
const router = express.Router();
const PageController = require("./../controllers/page_controller");
const AuthenticationController = require("./../controllers/authentication_controller");
const { celebrate, Joi } = require("celebrate");
const { authorize, check_user } = require("./../middleware/authentication_middleware");
const passport = require("passport");

router.get("/", PageController.index);

router.get("/login", check_user, AuthenticationController.loginForm);

router.post("/login", celebrate({
  body: {
    email: Joi.string().required(),
    password: Joi.string().required()
  }
}), passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login"
}));

router.get("/register", check_user, AuthenticationController.make);

router.post("/register", celebrate({
  body: {
    email: Joi.string().required(),
    password: Joi.string().required()
  }
}), AuthenticationController.create);

router.get("/dashboard", authorize, PageController.dashboard);

router.get("/logout", AuthenticationController.logout);

module.exports = router;