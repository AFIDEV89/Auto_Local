"use strict";
import express from "express";

import * as vehicleCategoriesCtr from "./VehicleCategoryController.js";

const router = express.Router();

/**
 * Vehicle category module api's
 */
router.post("/create", vehicleCategoriesCtr.createVehicleCategory);
router.put("/update", vehicleCategoriesCtr.updateVehicleCategory);
router.get("/get-list", vehicleCategoriesCtr.getVehicleCategoryList);
router.delete("/delete/:id", vehicleCategoriesCtr.deleteVehicleCategory);

export default router;
