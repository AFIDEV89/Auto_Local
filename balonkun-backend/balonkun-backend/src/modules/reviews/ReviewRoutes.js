"use strict";
import express from "express";

import * as reviewCtr from "./ReviewController.js";

const router = express.Router();

/**
 * Review module api's
 */
router.post("/create", reviewCtr.createReview);
router.put("/update/:id", reviewCtr.updateReview);
router.get("/get-list", reviewCtr.getReviewList);
router.delete("/delete/:id", reviewCtr.deleteReview);
router.get("/get-reviews-by-product-id/:id", reviewCtr.getReviewsByProductId);

export default router;
