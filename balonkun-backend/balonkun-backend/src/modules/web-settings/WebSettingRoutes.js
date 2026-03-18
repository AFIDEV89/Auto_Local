"use strict";
import express from "express";

import * as webSettingCtr from "./WebSettingController.js";

const router = express.Router();

/**
 * Web settings module api's
 */
router.post("/create", webSettingCtr.createWebSettings);
router.get("/detail", webSettingCtr.getWebSettings);
router.put("/update", webSettingCtr.updateWebSettings);

export default router;
