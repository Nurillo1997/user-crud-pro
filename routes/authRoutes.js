const router = require('express').Router();
const authCtrl = require('../controllers/authController');


// ================= AUTH ROUTES (PUBLIC) =================

router.get('/signup', authCtrl.signupPage);
router.post('/signup', authCtrl.signup);

router.get('/login', authCtrl.loginPage);
router.post('/login', authCtrl.login);

router.get('/logout', authCtrl.logout);

module.exports = router;