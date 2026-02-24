"use strict";
import express from "express";

import {
    create_seo_options, delete_seo_options, get_seo_filter,
    get_seo_footer,
    get_seo_header, get_seo_links,
    get_seo_list, get_seo_list_footer,
    update_seo_options
} from "./seo_data_controller.js";


const seo_data_router = express.Router();

/**
 * User blog module api's
 */



seo_data_router.post("/", create_seo_options)
seo_data_router.put("/:id", update_seo_options)
seo_data_router.delete("/:id", delete_seo_options)
seo_data_router.get("/", get_seo_header)
seo_data_router.get("/seo-links/all", get_seo_links)
seo_data_router.get("/listing/all", get_seo_list)
seo_data_router.get("/footer/all", get_seo_list_footer)
seo_data_router.get("/footer", get_seo_footer)
seo_data_router.get("/filter/:url_text", get_seo_filter)

export default seo_data_router;
