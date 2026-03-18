"use strict";
import express from "express";

import * as orderCtr from "./OrderController.js";

const router = express.Router();

/**
 * User product orders module api's
 */
router.post("/create", orderCtr.createOrder);
router.get("/get-list", orderCtr.getOrderList);

router.get("/user", orderCtr.getOrderForUser);

router.patch("/change-status/:id", orderCtr.updateOrderStatus);
router.patch("/courier_detail/:id", orderCtr.udpateCourierDetail);
router.get("/:id", orderCtr.getOrder);

export default router;