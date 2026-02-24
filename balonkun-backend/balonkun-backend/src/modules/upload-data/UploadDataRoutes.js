"use strict";
import express from "express";
import multer from 'multer';

import * as uploadDataCtr from "./UploadDataController.js";
import {
    changePicturePaths,
    deleteProducts,
    upload2wPictures,
    uploadAccessMatsPictures, uploadDescriptionAdditionalInfo,
    uploadPictures
} from "./uploadVehicles.js";
import {change_bucket_name, change_bucket_name_in_array} from "./change_image_s3.js";

const upload = multer();

const router = express.Router();

/**
 * Upload bulks of data module api's
 */
router.post("/vehicle-details", upload.single('file'), uploadDataCtr.uploadVehicleDetails);
router.post("/products", upload.single('file'), uploadDataCtr.uploadProducts);
router.post("/seat-covers", upload.single('file'), uploadDataCtr.uploadBulkData);
router.post("/prices", upload.single('file'), uploadDataCtr.uploadPrices);
router.post("/set-brand-model-vehicle-types", upload.single('file'), uploadDataCtr.setBrandModelVehicleTypes);
router.post("/colors", upload.single('file'), uploadDataCtr.uploadColors);
router.put("/update-product-name", uploadDataCtr.updateProductName);
router.post("/2w-seat-covers", upload.single('file'), uploadDataCtr.upload2WSheetCovers);
router.put("/replace-design-pictures-with-images", uploadDataCtr.replaceDesignPicturesWithImages);
router.post("/stores", upload.single('file'), uploadDataCtr.uploadStores);
router.post("/random", upload.single('file'), uploadDataCtr.uploadRandom);
router.put("/vehicle-categories", upload.single('file'), uploadDataCtr.uploadVehicleCategories);
router.put("/update-2w-product-prices", uploadDataCtr.update2WProductPrices);
router.put("/update-product-pictures", uploadDataCtr.updateProductPictures);
router.get("/read-seat-cover-prices", upload.single('file'), uploadDataCtr.readSeatCoverPrices);


router.post("/upload-pictures", upload.single('file'), uploadDescriptionAdditionalInfo);

router.post("/change_image_path",change_bucket_name_in_array)


export default router;
