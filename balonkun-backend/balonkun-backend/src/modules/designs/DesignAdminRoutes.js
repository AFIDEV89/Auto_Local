"use strict";
import express from "express";

import * as designCtr from "./DesignController.js";

const router = express.Router();

/**
 * Design module api's
 */
router.post("/create", designCtr.createDesign);
router.put("/update", designCtr.updateDesign);
router.get("/get-list", designCtr.getDesignList);
router.delete("/delete/:id", designCtr.deleteDesign);

export default router;
