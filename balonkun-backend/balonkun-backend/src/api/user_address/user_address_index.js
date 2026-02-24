"use strict";
import express from "express";

import {
    create_user_address,
    delete_user_address,
    get_user_address,
    update_user_address
} from "./user_address_controller.js";


const user_address_router = express.Router();

/**
 * User blog module api's
 */

user_address_router.get("/",get_user_address)
user_address_router.put("/:id",update_user_address)
user_address_router.delete("/:id",delete_user_address)
user_address_router.post("/", create_user_address)

export default user_address_router;
