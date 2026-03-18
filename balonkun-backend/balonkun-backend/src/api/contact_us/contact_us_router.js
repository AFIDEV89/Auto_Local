"use strict";
import express from "express";
import {contact_us_save} from "./contact_us_controller.js";



const contact_us_router = express.Router();

/**
 * User blog module api's
 */



contact_us_router.post("/", contact_us_save)

export default contact_us_router;
