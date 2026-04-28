"use strict";
import express from "express";
import multer from "multer";
import { importCsv, exportCsv } from "./csvController.js";

const upload = multer();
const csvRouter = express.Router();

// Export: GET /csv/export/:entityName → downloads CSV file
csvRouter.get("/export/:entityName", exportCsv);

// Import: POST /csv/import/:entityName → uploads CSV file
csvRouter.post("/import/:entityName", upload.single("file"), importCsv);

export default csvRouter;
