"use strict";
import express from "express";

import * as productWishlistCtr from "./WishlistController.js";

const router = express.Router();

/**
 * Product wishlist module api's
*/

router.put("/:id", productWishlistCtr.updateWishlist);
router.get("/", productWishlistCtr.getWishList);

export default router;
