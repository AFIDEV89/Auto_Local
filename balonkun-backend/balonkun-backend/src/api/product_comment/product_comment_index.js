"use strict";
import express from "express";

import {create_product_comments, get_product_comments} from "./product_comment_controller.js";


const product_comment_router = express.Router();

/**
 * User blog module api's
 */



product_comment_router.get("/:id",get_product_comments)
product_comment_router.post("/", create_product_comments)

export default product_comment_router;
