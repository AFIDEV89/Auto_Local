"use strict";
import express from "express";
import * as FranchiseController from "./FranchiseController.js";

const router = express.Router();

router.post("/franchise-inquiry", FranchiseController.franchiseInquiry);

export default router;
