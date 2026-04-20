"use strict";
import express from "express";
import * as subCategoryCtr from "./SubCategoryController.js";

const router = express.Router();

/**
 * SubCategory module api's
 */
router.post("/create", subCategoryCtr.createSubCategory);
router.put("/update/:id", subCategoryCtr.updateSubCategory);
router.get("/get-list", subCategoryCtr.getSubCategoryList);
router.get("/category/:category_id", subCategoryCtr.getSubCategoryByCategory);
router.delete("/delete/:id", subCategoryCtr.deleteSubCategory);

export default router;
