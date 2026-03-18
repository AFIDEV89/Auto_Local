"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import db from '../../database/index.js';
import * as DbHandler from "../../db-handlers/index.js";
import * as Utils from "../../utils/index.js";
import * as Validator from './VehicleDetailValidations.js';

/**
 * @method GetVehicleTypes: To get vehicle types
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const GetVehicleTypes = async (req, res) => {
    try {
        const list = await DbHandler.GetVehicleTypeList();
        if (Utils.isArray(list)) {
            res.json({
                statusCode: constants.GET_SUCCESS,
                message: 'Vehicle types fetched successfully.',
                data: list
            });
        } else {
            res.json({
                statusCode: constants.GET_SUCCESS,
                message: 'Vehicle types not available.',
                data: []
            });
        }
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method createVehicleDetail: To create new vehicle details
 * @param {Object} req request object
 * @param {Object} res response object
 */
const createVehicleDetail = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        Validator.createVehicleDetail,
        () => dao.createRow('vehicleDetails', req.body),
        constants.CREATION_SUCCESS,
        messages.vehicle_details.create
    );
};

/**
 * @method getVehicleDetailList: To get categories list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getVehicleDetailList(req, res) {
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => getVehicleDetailLists(req.query),
        constants.GET_SUCCESS,
        messages.vehicle_details.get_list
    );
};

export function getVehicleDetailLists(query={})  {
    return dao.getRows({
        tableName: constants.model_values.vehicle_detail.tableName,
        ...query,
        include: [
            { model: db[constants.model_values.brand.tableName], attributes: ['id', 'name'] },
            { model: db[constants.model_values.vehicle_type.tableName], attributes: ['id', 'name'] },
            { model: db[constants.model_values.brand_model.tableName], attributes: ['id', 'name', 'brand_id'] },
            { model: db[constants.model_values.vehicle_category.tableName], attributes: ['id', 'name'] }
        ]
    })
}

/**
 * @method updateVehicleDetail: To update existing vehicle details
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const updateVehicleDetail = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        Validator.updateVehicleDetail,
        async () => {
            await dao.updateRow('vehicleDetails', { id: req.params.id }, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.vehicle_details.update
    );
};

/**
 * @method deleteVehicleDetail: To delete existing vehicle details
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const deleteVehicleDetail = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteVehicleDetail,
        () => dao.deleteRow('vehicleDetails', { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.vehicle_details.delete
    );
};

/**
 * @method BulkUpload: To upload multiple vehicle details
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const BulkUpload = async (req, res) => {
    try {
        const length = 129;
        const makes = [
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "MAHINDRA",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO",
            "HERO"
        ];
        const models = ["XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 5 700", "XUV 500", "XUV 7 700", "XYLO 7 E6", "XYLO 7 E6", "XYLO 7", "XYLO 7 IH", "XYLO 7 IH", "XYLO 7", "XYLO 7 SPL", "XYLO 7 SPL", "XYLO 8 E6", "XYLO 8", "XYLO 8 IH E6", "XYLO 8 IH", "XYLO 8 IH", "XYLO 8", "XYLO 8 SPL E6", "XYLO 8 SPL", "XYLO 8 SPL", "N THAR", "O SCR 7 CAP", "O SCR 7 T1", "O SCR 7 T3", "O SCR 8 S", "O SCR 8 T1", "O SCR 8 T3", "O SCR 9 T1", "O SCR 9 T3", "BOLERO 721", "BOLERO 7  21", "BOLERO 7 REF", "KUV 5", "KUV 5", "KUV 6", "KUV 6", "MARAZZO 7", "MARAZZO 8", "MARAZZO 8", "Logan", "Logan", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 300", "XUV 5 700", "XUV 500", "XUV 7 700", "XYLO 7 E6", "XYLO 7 E6", "XYLO 7", "XYLO 7 IH", "XYLO 7 IH", "XYLO 7", "XYLO 7 SPL", "XYLO 7 SPL", "XYLO 8 E6", "XYLO 8", "XYLO 8 IH E6", "XYLO 8 IH", "XYLO 8 IH", "XYLO 8", "XYLO 8 SPL E6", "XYLO 8 SPL", "XYLO 8 SPL", "N THAR", "O SCR 7 CAP", "O SCR 7 T1", "O SCR 7 T3", "O SCR 8 S", "O SCR 8 T1", "O SCR 8 T3", "O SCR 9 T1", "O SCR 9 T3", "BOLERO 721", "BOLERO 7  21", "BOLERO 7 REF", "KUV 5", "KUV 5", "KUV 6", "KUV 6", "MARAZZO 7", "MARAZZO 8", "MARAZZO 8", "Logan", "Logan", "Passion Plus", "PASSION PRO BS4", "Passion Pro NEW (2017-18)", "Passion Pro BS6 /PASSION X-TECH", "Passion X Pro BS4", "Passion X Pro BS6", "Splendor (I)Smart BS4", "Splendor (I) SMART110 BS6", "Super Splendor (Old) BS4", "Super Splendor New(2017-18)", "Super Splendor BS6", "Glamour (Old) BS4", "Glamour New (2017-18)", "Glamour BS6", "CD DAWN", "C.D. Deluxe/HF Deluxe BS4/HF Deluxe BS6", "MAESTRO BS4", "Maestro Edge 125 BS6", "Destini BS4/DESTINI125 BS6", "Duet BS4", "Pleasure BS4", "PLEASURE PLUS BS6", "Hunk", "C.B.Z Extreme DUAL SEAT", "X-TREME-200 SINGLE SEAT", "X-TREME-160 SINGLE SEAT", "X PULSE 200/200T"];
        const variants = ["ABF", "EX", "LX", "NS", "SPL", "ABF", "EX", "LX", "NS", "SPL", "", "", "", "EX", "LX", "EX", "EX", "LX", "LX", "EX", "LX", "", "EX", "", "EX", "LX", "LX", "", "EX", "LX", "", "", "T1", "T3", "SLX", "", "", "", "", "EX", "LX", "", "EX", "LX", "EX", "LX", "", "EX", "LX", "EX", "LX", "ABF", "EX", "LX", "NS", "SPL", "ABF", "EX", "LX", "NS", "SPL", "", "", "", "EX", "LX", "EX", "EX", "LX", "LX", "EX", "LX", "", "EX", "", "EX", "LX", "LX", "", "EX", "LX", "", "", "T1", "T3", "SLX", "", "", "", "", "EX", "LX", "", "EX", "LX", "EX", "LX", "", "EX", "LX", "EX", "LX"];
        const vtids = [2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1];
        const vcids = [1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,];
        const months = ["March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "June",
            "June",
            "June",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "March",
            "June",
            "June",
            "June",];
        const years = [
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2012",
            "2012",
            "2012",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2019",
            "2012",
            "2012",
            "2012",
        ];
        console.log("makes", makes.length);
        console.log("models", models.length);
        console.log("variants", variants.length);
        console.log("vtid", vtids.length);
        console.log("vcid", vcids.length);
        console.log("month", months.length);
        console.log("year", years.length);
        const brands = await DbHandler.GetBrandList();
        const brandModels = await DbHandler.GetBrandModelList();
        // console.log("brands", brands, brandModels);
        let i = 0;
        const listToInsert = [];
        while (length > i) {
            const make = makes[i];
            const model = models[i];
            const variant = variants[i] || '';
            const vtid = vtids[i];
            const vcid = vcids[i];
            const month = months[i] || '';
            const year = years[i] || '';

            const brand = brands.find(br => br.name === make);
            const brandModel = brandModels.find(bm => bm.name === model);
            if (brand && brandModel && vtid) {
                const data = {
                    vehicle_type_id: vtid,
                    brand_id: brand.id,
                    model_id: brandModel.id,
                };
                if (month) {
                    data.month = month;
                }
                if (year) {
                    data.year = year;
                }
                if (vcid) {
                    data.vehicle_category_id = vcid;
                }
                if (variant) {
                    data.model_variant = variant;
                }
                listToInsert.push(data);
            }
            i++;
        }
        const result = await DbHandler.CreateManyVehicleDetail(listToInsert);
        res.json({ data: result });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

export { createVehicleDetail, getVehicleDetailList };
