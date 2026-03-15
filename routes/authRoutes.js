const router = require('express').Router();
const authCtrl = require('../controllers/authController');
const passport = require("passport");


// ================= AUTH ROUTES (PUBLIC) =================

router.get('/signup', authCtrl.signupPage);
router.post('/signup', authCtrl.signup);

router.get('/login', authCtrl.loginPage);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

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