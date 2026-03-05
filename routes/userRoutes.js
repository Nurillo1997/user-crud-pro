const router = require('express').Router();
const ctrl = require('../controllers/userController');


router.get('/', ctrl.home);

module.exports = router;