"use strict";
import express from "express";

import * as productCtr from "./ProductCategoryController.js";

const router = express.Router();

/**
 * Product category module api's
 */
router.post('/create', productCtr.createProductCategory);
router.put('/update/:id', productCtr.updateProductCategory);
router.get('/get-list', productCtr.getAdminProductCategoryList);
router.delete('/delete/:id', productCtr.deleteProductCategory);

export default router;
