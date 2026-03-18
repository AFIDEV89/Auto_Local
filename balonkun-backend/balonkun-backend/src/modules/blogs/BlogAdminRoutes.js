"use strict";
import express from "express";

import * as blogCtr from "./BlogController.js";

const router = express.Router();

/**
 * Admin blog module api's
 */
router.post("/", blogCtr.createBlog);
router.get("/", blogCtr.getOldDashboardList);
router.put("/:id", blogCtr.updateBlog);
router.delete("/:id", blogCtr.deleteBlog);

router.put("/header/:id", blogCtr.updateBlogHeader);

router.get("/header", blogCtr.getHeaderBlog);

export default router;
