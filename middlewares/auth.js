module.exports = (req, res, next) => {
  if (!req.session.user) {
    req.session.message = { type: "danger", message: "Please login first" };
    return res.redirect("/login");
  }
  next();
};
