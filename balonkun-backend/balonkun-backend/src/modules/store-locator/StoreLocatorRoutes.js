"use strict";
import express from "express";
import * as storeLocatorCtr from "./StoreLocatorController.js";

const router = express.Router();

/**
 * Isolated Store Locator Admin & Web API's
 */
router.post("/create", storeLocatorCtr.createStore);
router.put("/update/:id", storeLocatorCtr.updateStore);
router.get("/get-list", storeLocatorCtr.getStoreList);
router.delete("/delete/:id", storeLocatorCtr.deleteStore);
router.get("/get-states", storeLocatorCtr.getStates);
router.get("/get-cities", storeLocatorCtr.getCities);
router.post("/getStoreTimings", storeLocatorCtr.getStoreTimings);
router.get("/getRatings/:id", storeLocatorCtr.getRatings);
router.get("/get-detailed-ratings/:id", storeLocatorCtr.getDetailedRatings);
router.delete("/delete-rating", storeLocatorCtr.deleteRating);
router.post("/getStorebyState", storeLocatorCtr.getStorebyState);
router.post("/getStorebyname", storeLocatorCtr.getStorebyname);

export default router;
