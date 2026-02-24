"use strict";
import express from "express";
import {search} from "./SearchController.js";


const router = express.Router();

/**
 * Product wishlist module api's
*/
console.log("test")
router.get("/", search);

export default router;
