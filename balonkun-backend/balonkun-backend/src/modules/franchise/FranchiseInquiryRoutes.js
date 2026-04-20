"use strict";

import express from "express";
import { submitInquiry, getInquiries, updateInquiryStatus } from "./FranchiseInquiryController.js";
import userAuth from "../../middleware/userAuth.js"; // Optional, depending on if you want admin protection

const router = express.Router();

/**
 * Public endpoint to submit a franchise inquiry via the modal
 */
router.post("/franchise-inquiry", submitInquiry);

/**
 * Admin endpoints to manage inquiries
 */
// Here we might use userAuth or adminAuth depending on the project details, currently open for integration
router.get("/franchise-inquiry", getInquiries);
router.put("/franchise-inquiry/:id", updateInquiryStatus);

export default router;
