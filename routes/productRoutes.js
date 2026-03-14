const router = require('express').Router();
exports.router = router;
const ctrl = require('../controllers/productController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');



// ================= PROTECTED PRODUCT ROUTES =================

router.get('/', auth, ctrl.home);
router.get('/add', auth, ctrl.addPage);
router.post('/add', auth, upload, ctrl.addProduct);

router.get('/edit/:id', auth, ctrl.editPage);
router.post('/edit/:id', auth, upload, ctrl.editProduct);

router.get('/delete/:id', auth, ctrl.deleteProduct);


module.exports = router;