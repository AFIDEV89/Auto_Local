"use strict";
import express from "express";

import {create_lead, get_lead, update_lead, get_single_lead} from "./lead_data_controller.js";


const lead_data_router = express.Router();

/**
 * User blog module api's
 */

lead_data_router.get("/admin/",get_lead)
lead_data_router.get("/admin/:id", get_single_lead)
lead_data_router.put("/admin/:id",update_lead)
lead_data_router.post("/", create_lead)

export default lead_data_router;
