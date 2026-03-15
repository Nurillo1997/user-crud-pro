const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET /signup
exports.signupPage = async (req, res) => {
  res.render("signup", { title: "Sign up" });
};

// signup
exports.signup = async (req, res) => {
  const { fullName, name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    req.session.message = {
      type: "danger",
      message: "Email already registered"
    };
    return res.redirect("/signup");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    name,
    email,
    password: hashed,
  });

  await user.save();

  req.session.message = {
    type: "success",
    message: "Registered successfully"
  };

  res.redirect("/login");
};

// GET /login
exports.loginPage = async (req, res) => {
  if (req.query.msg === 'logout') {
    res.locals.message = {
      type: 'success',
      message: 'Logged out successfully'
    };
  }
  res.render("login", { title: "Login" });
};

// LOGOUT
exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.redirect("/login?msg=logout");
    });
  });
};
