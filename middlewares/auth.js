module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.message = {
      type: "danger",
      message: "Please login first",
    };
    return res.redirect("/login");
  }

  next();
};