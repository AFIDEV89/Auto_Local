"use strict";
import express from "express";

import * as vehicleDetailCtr from "./VehicleDetailController.js";

const router = express.Router();

/**
 * Vehicle detail module api's
 */
router.post("/create", vehicleDetailCtr.createVehicleDetail);
router.put("/update/:id", vehicleDetailCtr.updateVehicleDetail);
router.get("/get-list", vehicleDetailCtr.getVehicleDetailList);
router.delete("/delete/:id", vehicleDetailCtr.deleteVehicleDetail);
router.get("/vehicle-types", vehicleDetailCtr.GetVehicleTypes);
router.post('/bulk-upload', vehicleDetailCtr.BulkUpload);

export default router;
