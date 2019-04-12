const {Router} = require('express');
const imageController = require('../controllers/image.controller');
const isAuth = require('../middlewares/isAuth')
const gridFs = require('../middlewares/gridFs');

const router = new Router();

router.get('/:filename', imageController.getImage);
router.post('/', isAuth, gridFs.single('file'), imageController.postImage)

module.exports = router;