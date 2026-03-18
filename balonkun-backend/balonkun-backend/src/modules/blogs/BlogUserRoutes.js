"use strict";
import express from "express";

import * as blogCtr from "./BlogController.js";
import * as blogCategoryCtr from "../blog-categories/BlogCategoryController.js";
import blog_author_index from "../../api/blog_author/blog_author_index.js";

const router = express.Router();

router.use("/blog_author",blog_author_index)
/**
 * User blog module api's
 */

router.get("/header", blogCtr.getHeaderBlog);
router.get("/dashboard/", blogCtr.getOldDashboardList);
router.get("/category/", blogCtr.getList);
router.get("/categories/", blogCategoryCtr.getBlogCategoryList);
router.get("/popular/", blogCtr.getPopularBlogs);
router.get("/:id", blogCtr.getBlog);
router.get("/", blogCtr.getDashboardList);
export default router;
