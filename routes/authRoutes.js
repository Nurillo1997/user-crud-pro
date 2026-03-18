const router = require('express').Router();
const authCtrl = require('../controllers/authController');
const passport = require("passport");


// ================= AUTH ROUTES (PUBLIC) =================

router.get('/signup', authCtrl.signupPage);
router.post('/signup', authCtrl.signup);

router.get('/login', authCtrl.loginPage);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.session.message = {
        type: "danger",
        message: info?.message || "Invalid email or password",
      };
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get('/logout', authCtrl.logout);

// ================= GOOGLE OAUTH ROUTES (PUBLIC) =================
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;