"use strict";
import express from "express";

import * as dashboardCtr from "./DashboardController.js";

const router = express.Router();

/**
 * Dasboard module api's
 */

router.get("/get-product-list", dashboardCtr.getDashboardProductList);

export default router;
