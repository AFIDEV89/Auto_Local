"use strict";
import express from "express";

import * as cartProductCtr from "../../controllers/index.js";

const router = express.Router();

/**
 * Cart product module api's
 */
router.post("/create", cartProductCtr.AddProductToCart);
router.put("/update/:id", cartProductCtr.UpdateCartProduct);
router.delete("/delete/:id", cartProductCtr.RemoveProductFromCart);
router.get("/get-list", cartProductCtr.getCartProductList);
router.get("/count", cartProductCtr.GetTotalNoOfCartProducts);

export default router;
