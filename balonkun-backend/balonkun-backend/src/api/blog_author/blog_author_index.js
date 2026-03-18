"use strict";
import express from "express";
import {
    create_blog_author,
    get_blog_author,
    get_blog_author_list,
    update_blog_author
} from "./blog_author_controller.js";


const router = express.Router();

/**
 * User blog module api's
 */

router.get("/",get_blog_author_list)
router.get("/:id",get_blog_author)
router.put("/:id",update_blog_author)
router.post("/", create_blog_author)

export default router;
