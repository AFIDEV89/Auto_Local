"use strict";
import express from "express";

import * as bannerCtr from "./BannerController.js";

const router = express.Router();

/**
 * Banner module api's
 */
router.get("/get-list", bannerCtr.getWebsiteBannerList);

export default router;
