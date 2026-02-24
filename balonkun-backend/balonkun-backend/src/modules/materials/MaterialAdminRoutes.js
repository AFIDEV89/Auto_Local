"use strict";
import express from "express";

import * as materialCtr from "./MaterialController.js";

const router = express.Router();

/**
 * Material module api's
 */
router.post("/create", materialCtr.createMaterial);
router.put("/update/:id", materialCtr.updateMaterial);
router.get("/get-list", materialCtr.getMaterialList);
router.delete("/delete/:id", materialCtr.deleteMaterial);

export default router;
