"use strict";
import express from "express";

import * as Controllers from "../controllers/index.js";
import user_address_router from "../api/user_address/user_address_index.js";

const router = express.Router();

/**
 * User module api's
 */
router.get("/login", Controllers.UserLogin);
router.post("/sign-up", Controllers.UserSignUp);
router.post("/admin/sign-up",/*requireScope("admin"),*/ Controllers.UserSignUp);
router.patch("/update", Controllers.UpdateUser);
router.patch("/admin/update",/*requireScope("admin"),*/ Controllers.UpdateUser);
router.get("/get-list",/*requireScope("admin"), */Controllers.get_user_list);
router.get("/verify-email/:token", Controllers.VerifyUserEmail);
router.get('/refresh-token/:id', Controllers.GetRefrehToken);
router.patch("/resend-verify-email", Controllers.ResendVerifyUserEmail);
router.put("/logout", Controllers.LogoutUser);
router.patch('/forgot-password', Controllers.SendInviteToResetPassword);
router.patch('/reset-password', Controllers.ResetUserPassword);
router.patch('/change-password', Controllers.ChangeUserPassword);

router.use('/address',user_address_router)

export default router;
