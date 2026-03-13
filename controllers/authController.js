const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET /signup
exports.signupPage = async (req, res) => {
  res.render("signup", { title: "Sign up" });
};

// signup
exports.signup = async (req, res) => {
  const { fullName, name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    name,
    email,
    password: hashed,
  });

  await user.save();

  req.session.message = { type: "success", message: "Registered!" };
  res.redirect("/login");
};

// GET /login
exports.loginPage = async (req, res) => {
  res.render("login", { title: "Login" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.session.message = { type: 'danger', message: 'User not found' };
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.message = { type: 'danger', message: 'Wrong password' };
    return res.redirect('/login');
  }

  // sessionga user saqlaymiz
  req.session.message = { type: 'success', message: 'Loged in successfully' };
  req.session.user = user._id;

  res.redirect('/');
};
