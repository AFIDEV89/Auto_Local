"use strict";
import express from "express";

import * as storeCtr from "./StoreController.js";

const router = express.Router();

/**
 * Store module api's
 */
router.post("/create", storeCtr.createStore);
router.put("/update/:id", storeCtr.updateStore);
router.get("/get-list", storeCtr.getStoreList);
router.delete("/delete/:id", storeCtr.deleteStore);
router.get("/:id", storeCtr.getStore);

export default router;
