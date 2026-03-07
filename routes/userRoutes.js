const router = require('express').Router();
const ctrl = require('../controllers/userController');
const upload = require('../middlewares/upload');

router.get('/', ctrl.home);
router.get('/add', ctrl.addPage);
router.post('/add', upload, ctrl.addUser);
router.get('/edit/:id', ctrl.editPage);
router.post('/edit/:id', upload, ctrl.editUser);
module.exports = router;