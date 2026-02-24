"use strict";
import express from "express";

import * as productCtr from "./ProductController.js";
import product_comment_router from "../../api/product_comment/product_comment_index.js";
import {get_product_comments} from "../../api/product_comment/product_comment_controller.js";

const router = express.Router();

/**
 * Product module api's
*/

router.get('/comments/:id', get_product_comments);

router.post("/get-list", productCtr.getUserProductList);
router.get('/filters', productCtr.getFilters);
router.get("/related-products", productCtr.getUserRelatedProductList);

// router.get("/canonical/:id", productCtr.getUserProductCanonical);
router.get("/:id", productCtr.getUserProduct);

export default router;
