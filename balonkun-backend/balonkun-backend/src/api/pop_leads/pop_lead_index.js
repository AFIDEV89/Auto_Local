"use strict";
import express from "express";
import {create_pop_lead, get_pop_leads, update_pop_lead, delete_pop_lead} from "./pop_lead_controller.js";

const pop_lead_router = express.Router();

pop_lead_router.get("/admin/", get_pop_leads);
pop_lead_router.put("/admin/:id", update_pop_lead);
pop_lead_router.delete("/admin/:id", delete_pop_lead);
pop_lead_router.post("/", create_pop_lead);

export default pop_lead_router;
