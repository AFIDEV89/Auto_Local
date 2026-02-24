"use strict";
import express from "express";

import * as bannerCtr from "./BannerController.js";

const router = express.Router();

/**
 * Banner module api's
 */
router.post("/create", bannerCtr.createBanner);
router.put("/update", bannerCtr.updateBanner);
router.get("/get-list", bannerCtr.getList);
router.delete("/delete/:id", bannerCtr.deleteBanner);

export default router;
