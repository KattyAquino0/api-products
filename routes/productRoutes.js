const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateProduct = require('../middlewares/validateProduct');
const upload = require('../middlewares/uploadImages');

router.post('/', upload.array('imagenes', 4), validateProduct, productController.create);
router.get('/', productController.list);
router.get('/:id', productController.getOne);
router.put('/:id', upload.array('imagenes', 4), validateProduct, productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
