"use strict";

import express from "express";
import { 
    getTestimonials, 
    addTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
} from "./TestimonialController.js";

const router = express.Router();

/**
 * Public & Admin endpoints for Testimonials
 */
router.get("/", getTestimonials);
router.post("/", addTestimonial);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
