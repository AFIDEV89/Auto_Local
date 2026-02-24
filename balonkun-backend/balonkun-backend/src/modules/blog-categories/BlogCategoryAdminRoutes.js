"use strict";
import express from "express";

import * as blogCategoryCtr from "./BlogCategoryController.js";

const router = express.Router();

/**
 * Admin blog category module api's
 */
router.get("/", blogCategoryCtr.getBlogCategoryList);
router.post("/", blogCategoryCtr.createBlogCategory);
router.put("/", blogCategoryCtr.updateBlogCategory);
router.delete("/:id", blogCategoryCtr.deleteBlogCategory);

export default router;
