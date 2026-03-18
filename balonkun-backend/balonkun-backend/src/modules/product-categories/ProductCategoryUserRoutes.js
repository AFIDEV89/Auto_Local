"use strict";
import express from "express";

import * as productCtr from "./ProductCategoryController.js";

const router = express.Router();

/**
 * Product category module api's for user app
 */
router.get('/get-list', productCtr.getUserProductCategoryList);

export default router;
