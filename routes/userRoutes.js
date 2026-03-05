const router = require('express').Router();
const ctrl = require('../controllers/userController');


router.get('/', ctrl.home);
router.get('/add', ctrl.addPage);
module.exports = router;