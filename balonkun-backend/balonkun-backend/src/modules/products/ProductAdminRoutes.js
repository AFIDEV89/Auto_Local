"use strict";
import express from "express";

import * as productCtr from "./ProductController.js";
import product_comment_router from "../../api/product_comment/product_comment_index.js";
import multer from "multer";

const router = express.Router();
const upload = multer();
/**
 * Product module api's
*/

router.use('/comments', product_comment_router);

router.get("/product-gallery/:id", productCtr.getProductGallery);
router.post("/create", productCtr.createProduct);
router.put("/update/:id", productCtr.updateProduct);
router.get("/get-list", productCtr.getProductList);
router.delete("/delete/:id", productCtr.deleteProduct);
router.get("/price", productCtr.getProductPrice);
router.get("/:id", productCtr.getProduct);
router.post('/bulk_create', upload.single('file'), productCtr.bulkCreateProduct);
router.put('/hide-show/:id', productCtr.setHideShowProduct);
router.post('/toggle-ecommerce', productCtr.toggleEcommerceProduct);

export default router;
