const express = require('express');
const { getAllProduct, createProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();

router.route("/products").get(getAllProduct);
router.route("/product/new").post(createProduct)
router.route("/product/:id").put(updateProduct)

module.exports= router;