"use strict";
import express from "express";

import * as brandCtr from "./BrandController.js";

const router = express.Router();

/**
 * Brand module api's
 */
router.post("/create", brandCtr.createBrand);
router.put("/update", brandCtr.updateBrand);
router.get("/get-list", brandCtr.getBrandList);
router.delete("/delete/:id", brandCtr.deleteBrand);

export default router;
