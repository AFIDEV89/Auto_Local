"use strict";
import express from "express";

import * as brandModelCtr from "./BrandModelController.js";

const router = express.Router();

/**
 * Brand model module api's
 */
router.post("/create", brandModelCtr.createBrandModel);
router.put("/update", brandModelCtr.updateBrandModel);
router.get("/get-list", brandModelCtr.getBrandModelList);
router.delete("/delete/:id", brandModelCtr.deleteBrandModel);

export default router;
