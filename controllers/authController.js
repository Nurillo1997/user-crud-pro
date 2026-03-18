const User = require("../models/User");
const bcrypt = require("bcrypt");

/* GET SIGNUP */
exports.signupPage = (_, res) => {
  res.render("signup", { title: "Sign up" });
};

/* POST SIGNUP */
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    req.session.message = { type: "danger", message: "Email already exists" };
    return res.redirect("/signup");
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
  });

  req.session.message = { type: "success", message: "Account created" };
  res.redirect("/login");
};

/* GET LOGIN */
exports.loginPage = (req, res) => {
  if (req.query.msg === "logout") {
    res.locals.message = {
      type: "success",
      message: "Logged out successfully",
    };
  }

  res.render("login", { title: "Login" });
};

/* LOGOUT */
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.redirect("/login?msg=logout");
    });
  });
};