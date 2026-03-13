const router = require('express').Router();
const ctrl = require('../controllers/productController');
const authCtrl = require('../controllers/authController');
const upload = require('../middlewares/upload');

//PRODUCT controllers

router.get('/', ctrl.home);
router.get('/add', ctrl.addPage);
router.post('/add', upload, ctrl.addProduct);
router.get('/edit/:id', ctrl.editPage);
router.post('/edit/:id', upload, ctrl.editProduct);
router.get('/delete/:id', ctrl.deleteProduct);

//AUTH controllers

router.get('/signup', authCtrl.signupPage);
router.post('/signup', authCtrl.signup)

router.get('/login', authCtrl.loginPage);
router.post('/login', authCtrl.login);

//Logout
router.get('/logout', authCtrl.logout);

module.exports = router;