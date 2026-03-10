const router = require('express').Router();
const ctrl = require('../controllers/userController');
const upload = require('../middlewares/upload');

router.get('/', ctrl.home);
router.get('/add', ctrl.addPage);
router.post('/add', upload, ctrl.addProduct);
router.get('/edit/:id', ctrl.editPage);
router.post('/edit/:id', upload, ctrl.editProduct);
router.get('/delete/:id', ctrl.deleteProduct);
router.get('/login', ctrl.loginPage);
router.get('/signup', ctrl.signupPage);
module.exports = router;