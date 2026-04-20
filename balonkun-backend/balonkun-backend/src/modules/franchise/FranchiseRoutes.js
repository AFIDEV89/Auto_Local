"use strict";
import express from "express";
import * as FranchiseController from "./FranchiseController.js";

const router = express.Router();

router.post("/franchise-inquiry", FranchiseController.franchiseInquiry);
router.get("/franchise-inquiry", FranchiseController.getInquiries);
router.put("/franchise-inquiry/:id", FranchiseController.updateInquiryStatus);

export default router;
