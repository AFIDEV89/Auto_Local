"use strict";
import express from "express";

import * as colorCtr from "./ColorController.js";

const router = express.Router();

/**
 * Color module api's
 */
router.post("/create", colorCtr.createColor);
router.put("/update/:id", colorCtr.updateColor);
router.get("/get-list", colorCtr.getColorList);
router.delete("/delete/:id", colorCtr.deleteColor);

export default router;
