"use strict";
import sequelize from "sequelize";
import xlsx from 'xlsx';
import * as validations from '../../common/joi.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import db from "../../database/index.js";
import { titleCase } from '../../utils/String.js';
// import StaticData from './StaticData.js';
import { parseAddress } from './Utils.js';

const { Op } = sequelize;

/**
 * @method uploadVehicleDetails: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const uploadVehicleDetails = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {
                // Check if file was uploaded
                if (!req.file) {
                    reject('please provide excel file');
                }

                // Read Excel file
                const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Extract data from sheet as columns
                const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                // Get column names
                const columnNames = data[0];

                // Get column data
                const columns = {};
                for (let i = 1; i < data.length; i++) {
                    for (let j = 0; j < columnNames.length; j++) {
                        const columnName = columnNames[j];
                        const cellValue = data[i][j];
                        columns[columnName] = columns[columnName] || [];
                        columns[columnName].push(cellValue);
                    }
                }

                if (!!columns?.['Make']?.length) {
                    const uniqueMakes = [...new Set(columns['Make'])];
                    for (let make of uniqueMakes) {
                        if (make) {
                            const isExists = await dao.getRow('brands', { name: make.trim() });
                            if (!isExists) {
                                await dao.createRow('brands', { name: make.trim() });
                            }
                        }
                    }

                    const models = columns?.['Model'] || [];
                    for (let i = 0; i < models.length; i++) {
                        const model = models[i]?.trim();
                        const brand = columns['Make']?.[i]?.trim();
                        if (model && brand) {
                            const isExistsBrand = await dao.getRow('brands', { name: brand });
                            if (isExistsBrand) {
                                const isExists = await dao.getRow(constants.model_values.brand_model.tableName, { name: model });
                                if (!isExists) {
                                    await dao.createRow(constants.model_values.brand_model.tableName, { name: model, brand_id: isExistsBrand.id });
                                }
                            }
                        }
                    }
                }

                const vehicleCategories = columns?.['Vehicle Category'] || [];
                if (!!vehicleCategories.length) {
                    const uniqueVehicleCategories = [...new Set(vehicleCategories)];
                    for (let vehicleCategory of uniqueVehicleCategories) {
                        if (vehicleCategory) {
                            const isExists = await dao.getRow(constants.model_values.vehicle_category.tableName, { name: vehicleCategory.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.vehicle_category.tableName, { name: vehicleCategory.trim() });
                            }
                        }
                    }
                }

                const designs = columns?.['Design'] || [];
                if (!!designs.length) {
                    const uniqueDesigns = [...new Set(designs)];
                    for (let design of uniqueDesigns) {
                        if (design) {
                            const isExists = await dao.getRow(constants.model_values.design.tableName, { name: design.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.design.tableName, { name: design.trim() });
                            }
                        }
                    }
                }

                const materials = columns?.['Design Material'] || [];
                if (!!materials.length) {
                    const uniqueMaterials = [...new Set(materials)];
                    for (let material of uniqueMaterials) {
                        if (material) {
                            const isExists = await dao.getRow(constants.model_values.material.tableName, { name: material.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.material.tableName, { name: material.trim() });
                            }
                        }
                    }
                }

                const majorColors = columns?.['Major Color'] || [];
                let colors = [...new Set(majorColors)];
                const minorColors = columns?.['Minor Color'] || [];
                if (!!minorColors.length) {
                    const uniqueMinorColors = [...new Set(minorColors)];
                    const arrayOfStrings = [];
                    for (let color of uniqueMinorColors) {
                        arrayOfStrings.push(...color.split(/,\s*/));
                    }
                    colors.push(...arrayOfStrings);
                }
                const uniqueColors = [...new Set(colors)].map(color => titleCase(color));
                if (!!uniqueColors.length) {
                    for (let color of uniqueColors) {
                        if (color) {
                            const isExists = await dao.getRow(constants.model_values.color.tableName, { name: color.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.color.tableName, { name: color.trim() });
                            }
                        }
                    }
                }

                const fields = data?.[0];
                if (!!fields.length) {
                    const brandIndex = fields.indexOf('Make');
                    const modelIndex = fields.indexOf('Model');
                    const modelVariantIndex = fields.indexOf("Model Variant");
                    const vehicleTypeIndex = fields.indexOf("Vehicle Type");
                    const vehicleCategoryIndex = fields.indexOf("Vehicle Category");
                    const monthIndex = fields.indexOf("Month");
                    const yearIndex = fields.indexOf("Year");

                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                    for (let i = 1; i < data.length; i++) {
                        const vehicleDetails = data[i];
                        if (!!vehicleDetails.length) {
                            const brand = vehicleDetails[brandIndex] ? await dao.getRow(constants.model_values.brand.tableName, { name: vehicleDetails[brandIndex].trim() }) : null;
                            const model = vehicleDetails[modelIndex] ? await dao.getRow(constants.model_values.brand_model.tableName, { name: vehicleDetails[modelIndex].trim() }) : null;
                            const modelVariant = vehicleDetails[modelVariantIndex];
                            const vehicleType = vehicleDetails[vehicleTypeIndex] ? await dao.getRow(constants.model_values.vehicle_type.tableName, { name: vehicleDetails[vehicleTypeIndex].trim() }) : null;
                            const vehicleCategory = vehicleDetails[vehicleCategoryIndex] ? await dao.getRow(constants.model_values.vehicle_category.tableName, { name: vehicleDetails[vehicleCategoryIndex].trim() }) : null;;
                            const month = vehicleDetails[monthIndex];
                            const year = vehicleDetails[yearIndex];

                            // const isValid = vehicleDetails[vehicleTypeIndex] === '4W'
                            //     ? brand && model && modelVariant && vehicleType && vehicleCategory && month && year
                            //     : brand && model && vehicleType;
                            const isValid = brand && model && vehicleType;

                            if (isValid) {
                                const dataToSave = {
                                    vehicle_type_id: vehicleType.id,
                                    brand_id: brand.id,
                                    model_id: model.id,
                                };
                                if (modelVariant) {
                                    dataToSave.model_variant = modelVariant;
                                }
                                if (vehicleCategory?.id) {
                                    dataToSave.vehicle_category_id = vehicleCategory.id;
                                }
                                if (month) {
                                    dataToSave.month = months.find(mth => mth.includes(month));
                                }
                                if (year) {
                                    dataToSave.year = year;
                                }
                                let vehicleDetail = await dao.getRow(constants.model_values.vehicle_detail.tableName, dataToSave);
                                if (!(vehicleDetail?.id)) {
                                    await dao.createRow(constants.model_values.vehicle_detail.tableName, dataToSave);
                                }
                            }
                        }
                    }
                }

                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method uploadProducts: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const uploadProducts = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {
                // Check if file was uploaded
                if (!req.file) {
                    reject('please provide excel file');
                }

                // Read Excel file
                const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Extract data from sheet as columns
                const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                // Get column names
                const columnNames = data[0];

                // Get column data
                const columns = {};
                for (let i = 1; i < data.length; i++) {
                    for (let j = 0; j < columnNames.length; j++) {
                        const columnName = columnNames[j];
                        const cellValue = data[i][j];
                        columns[columnName] = columns[columnName] || [];
                        columns[columnName].push(cellValue);
                    }
                }

                const fields = data?.[0];
                if (!!fields.length) {
                    const productNameIndex = fields.indexOf('Product Name');
                    const priceIndex = fields.indexOf("Price");
                    const categoryIndex = fields.indexOf('Category');
                    const vehicleTypeIndex = fields.indexOf('Vehicle Type');
                    const imagesIndex = fields.indexOf('Images');

                    for (let i = 1; i < data.length; i++) {
                        const productDetail = data[i];
                        if (!!productDetail.length) {
                            const productName = productDetail[productNameIndex];
                            const price = productDetail[priceIndex];
                            const category = productDetail[categoryIndex] ? await dao.getRow(constants.model_values.product_category.tableName, { name: productDetail[categoryIndex].trim() }) : null;
                            const vehicleType = productDetail[vehicleTypeIndex] ? await dao.getRow(constants.model_values.vehicle_type.tableName, { name: productDetail[vehicleTypeIndex].trim() }) : null;
                            const images = productDetail[imagesIndex];

                            const isValid = !!(productName && price && category && vehicleType);
                            if (isValid) {
                                const dataToSave = {
                                    name: productName,
                                    original_price: price,
                                    category_id: category.id,
                                    vehicle_type_id: vehicleType.id,
                                    is_trending: true,
                                    is_latest: true,
                                    vehicle_details_id: null
                                };
                                if (images) {
                                    dataToSave.pictures = JSON.parse(images);
                                }
                                await dao.createRow(constants.model_values.product.tableName, dataToSave);
                            }
                        }
                    }
                }

                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};
export const uploadPrices = async (req, res) => {
    if (!req.file) {
        reject('please provide excel file');
    }

    // Read Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Extract data from sheet as columns
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Get column names
    const columnNames = data[0];

    // Get column data
    const columns = {};
    for (let i = 1; i < data.length; i++) {
        columns[data[i][0]]={
            'BasePrice':data[i][1],
            '1':data[i][2],
            '2':data[i][3],
            '3':data[i][4],

        }
        // columns.push(rowData)
    }

    let data1 = await dao.getRows({
        tableName: constants.model_values.product_variants.tableName,
        include: [
        {
            model: db[constants.model_values.product.tableName],
            include:[{
                model: db[constants.model_values.vehicle_detail.tableName]
            }
            ],

        },
            {
                model: db[constants.model_values.design.tableName]
            }
    ]
    })
    for(let data11 of data1) {

        if(data11.product && data11.design) {
            console.log("****************************  Updating ************************")
            console.log("Proudct id "+data11.product.id)
            console.log("Category ID " + data11.product.vehicle_detail.vehicle_category_id)

            //console.log(data1.product.original_price)
            console.log("Design Name ID " +data11.design.name)

            let priceData = columns[data11.design.name];
            console.log(priceData)

            let productPrice = priceData['BasePrice'];
            //console.log(productPrice)
            productPrice = productPrice + (priceData[data11.product.vehicle_detail.vehicle_category_id]);
            // console.log(priceData[data1.product.vehicle_type_id])
            console.log(data11.product.name+" final price "+productPrice)
            await dao.updateRow(constants.model_values.product.tableName,
                { id: data11.product.id },
                {original_price:productPrice});
            console.log("****************Updating done ************")
        }
    }




}
/**
 * @method uploadBulkData: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const uploadBulkData = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {
                // Check if file was uploaded
                if (!req.file) {
                    reject('please provide excel file');
                }

                // Read Excel file
                const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Extract data from sheet as columns
                const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                // Get column names
                const columnNames = data[0];

                // Get column data
                const columns = {};
                for (let i = 1; i < data.length; i++) {
                    for (let j = 0; j < columnNames.length; j++) {
                        const columnName = columnNames[j];
                        const cellValue = data[i][j];
                        columns[columnName] = columns[columnName] || [];
                        columns[columnName].push(cellValue);
                    }
                }

                if (!!columns?.['Product Category']?.length) {
                    const uniqueProductCategories = [...new Set(columns['Product Category'])];
                    for (let category of uniqueProductCategories) {
                        if (category) {
                            const isExists = await dao.getRow(constants.model_values.product_category.tableName, { name: category.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.product_category.tableName, { name: category.trim() });
                            }
                        }
                    }
                }

                if (!!columns?.['Vehicle Type']?.length) {
                    const uniqueVehicleTypes = [...new Set(columns['Vehicle Type'])];
                    for (let vehicleType of uniqueVehicleTypes) {
                        if (vehicleType) {
                            const isExists = await dao.getRow(constants.model_values.vehicle_type.tableName, { name: vehicleType.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.vehicle_type.tableName, { name: vehicleType.trim() });
                            }
                        }
                    }
                }

                const designNames = columns?.['Design Name'] || [];
                const basePrices = columns?.['Base Price'] || [];
                const sectionAPrices = columns?.['Section A'] || [];
                const sectionBPrices = columns?.['Section B'] || [];
                const sectionCPrices = columns?.['Section C'] || [];

                if (!!columns?.['Make']?.length) {
                    const uniqueMakes = [...new Set(columns['Make'])];
                    for (let make of uniqueMakes) {
                        if (make) {
                            const isExists = await dao.getRow('brands', { name: make.trim() });
                            if (!isExists) {
                                await dao.createRow('brands', { name: make.trim() });
                            }
                        }
                    }

                    const models = columns?.['Model'] || [];
                    for (let i = 0; i < models.length; i++) {
                        const model = models[i]?.trim();
                        const brand = columns['Make']?.[i]?.trim();
                        if (model && brand) {
                            const isExistsBrand = await dao.getRow('brands', { name: brand });
                            if (isExistsBrand) {
                                const isExists = await dao.getRow(constants.model_values.brand_model.tableName, { name: model });
                                if (!isExists) {
                                    await dao.createRow(constants.model_values.brand_model.tableName, { name: model, brand_id: isExistsBrand.id });
                                }
                            }
                        }
                    }
                }

                const vehicleCategories = columns?.['Vehicle Category'] || [];
                if (!!vehicleCategories.length) {
                    const uniqueVehicleCategories = [...new Set(vehicleCategories)];
                    for (let vehicleCategory of uniqueVehicleCategories) {
                        if (vehicleCategory) {
                            const isExists = await dao.getRow(constants.model_values.vehicle_category.tableName, { name: vehicleCategory.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.vehicle_category.tableName, { name: vehicleCategory.trim() });
                            }
                        }
                    }
                }

                const designs = columns?.['Design'] || [];
                if (!!designs.length) {
                    const uniqueDesigns = [...new Set(designs)];
                    for (let design of uniqueDesigns) {
                        if (design) {
                            const isExists = await dao.getRow(constants.model_values.design.tableName, { name: design.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.design.tableName, { name: design.trim() });
                            }
                        }
                    }
                }

                const materials = columns?.['Design Material'] || [];
                if (!!materials.length) {
                    const uniqueMaterials = [...new Set(materials)];
                    for (let material of uniqueMaterials) {
                        if (material) {
                            const isExists = await dao.getRow(constants.model_values.material.tableName, { name: material.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.material.tableName, { name: material.trim() });
                            }
                        }
                    }
                }

                const majorColors = columns?.['Major Color'] || [];
                let colors = [...new Set(majorColors)];
                const minorColors = columns?.['Minor Color'] || [];
                if (!!minorColors.length) {
                    const uniqueMinorColors = [...new Set(minorColors)];
                    const arrayOfStrings = [];
                    for (let color of uniqueMinorColors) {
                        if (color) {
                            arrayOfStrings.push(...color.split(/,\s*/));
                        }
                    }
                    colors.push(...arrayOfStrings);
                }
                const uniqueColors = [...new Set(colors)].map(color => titleCase(color));
                if (!!uniqueColors.length) {
                    for (let color of uniqueColors) {
                        if (color) {
                            const isExists = await dao.getRow(constants.model_values.color.tableName, { name: color.trim() });
                            if (!isExists) {
                                await dao.createRow(constants.model_values.color.tableName, { name: color.trim() });
                            }
                        }
                    }
                }

                const fields = data?.[0];
                if (!!fields.length) {
                    const brandIndex = fields.indexOf('Make');
                    const modelIndex = fields.indexOf('Model');
                    const modelVariantIndex = fields.indexOf("Model Variant");
                    const vehicleTypeIndex = fields.indexOf("Vehicle Type");
                    const vehicleCategoryIndex = fields.indexOf("Vehicle Category");
                    const monthIndex = fields.indexOf("Month");
                    const yearIndex = fields.indexOf("Year");

                    // creating product variants
                    const designIndex = fields.indexOf('Design');
                    const designMaterialIndex = fields.indexOf('Design Material');
                    const productCategoryIndex = fields.indexOf('Product Category');
                    const majorColorIndex = fields.indexOf('Major Color');
                    const minorColorsIndex = fields.indexOf('Minor Color');

                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                    for (let i = 1; i < data.length; i++) {
                        const vehicleDetails = data[i];
                        if (!!vehicleDetails.length) {
                            const brand = vehicleDetails[brandIndex] ? await dao.getRow(constants.model_values.brand.tableName, { name: vehicleDetails[brandIndex].trim() }) : null;
                            const model = vehicleDetails[modelIndex] ? await dao.getRow(constants.model_values.brand_model.tableName, { name: vehicleDetails[modelIndex].trim() }) : null;
                            const modelVariant = vehicleDetails[modelVariantIndex];
                            const vehicleType = vehicleDetails[vehicleTypeIndex] ? await dao.getRow(constants.model_values.vehicle_type.tableName, { name: vehicleDetails[vehicleTypeIndex].trim() }) : null;
                            const vehicleCategory = vehicleDetails[vehicleCategoryIndex] ? await dao.getRow(constants.model_values.vehicle_category.tableName, { name: vehicleDetails[vehicleCategoryIndex].trim() }) : null;;
                            const month = vehicleDetails[monthIndex];
                            const year = vehicleDetails[yearIndex];

                            // const isValid = vehicleDetails[vehicleTypeIndex] === '4W'
                            //     ? brand && model && modelVariant && vehicleType && vehicleCategory && month && year
                            //     : brand && model && vehicleType;
                            const isValid = brand && model && vehicleType;

                            if (isValid) {
                                const dataToSave = {
                                    vehicle_type_id: vehicleType.id,
                                    brand_id: brand.id,
                                    model_id: model.id,
                                };
                                if (modelVariant) {
                                    dataToSave.model_variant = modelVariant;
                                }
                                if (vehicleCategory?.id) {
                                    dataToSave.vehicle_category_id = vehicleCategory.id;
                                }
                                if (month) {
                                    dataToSave.month = months.find(mth => mth.includes(month));
                                }
                                if (year) {
                                    dataToSave.year = year;
                                }
                                let vehicleDetail = await dao.getRow(constants.model_values.vehicle_detail.tableName, dataToSave);
                                if (!(vehicleDetail?.id)) {
                                    vehicleDetail = await dao.createRow(constants.model_values.vehicle_detail.tableName, dataToSave);
                                }
                                if (vehicleDetail?.id) {
                                    const design = vehicleDetails[designIndex] ? await dao.getRow(constants.model_values.design.tableName, { name: vehicleDetails[designIndex].trim() }) : null;
                                    const designMaterial = vehicleDetails[designMaterialIndex] ? await dao.getRow(constants.model_values.material.tableName, { name: vehicleDetails[designMaterialIndex].trim() }) : null;
                                    const productCategory = vehicleDetails[productCategoryIndex] ? await dao.getRow(constants.model_values.product_category.tableName, { name: vehicleDetails[productCategoryIndex].trim() }) : null;
                                    const majorColor = vehicleDetails[majorColorIndex] ? await dao.getRow(constants.model_values.color.tableName, { name: vehicleDetails[majorColorIndex].trim() }) : null;

                                    // getting minor colors
                                    let minorColors = vehicleDetails[minorColorsIndex]?.split(/,\s*/);
                                    if (!!(minorColors?.length)) {
                                        const colors = await dao.getRows({
                                            tableName: constants.model_values.color.tableName,
                                            query: { name: { [Op.in]: minorColors } }
                                        });
                                        if (!!(colors?.length)) {
                                            minorColors = colors.slice();
                                        } else {
                                            minorColors = null;
                                        }
                                    }

                                    if (design && designMaterial && productCategory && vehicleType && majorColor && !!(minorColors?.length)) {
                                        // const productName = `${design.name || ''} ${designMaterial.name || ''} ${productCategory.name || ''}`;
                                        const productName = `${design.name || ''} ${designMaterial.name || ''} Seat Cover`;
                                        if (productName) {
                                            const productDesignIndex = designNames.findIndex(des => des === design.name);
                                            if (productDesignIndex > -1) {
                                                let productPrice = basePrices[productDesignIndex] || 0;
                                                if (vehicleCategory.name === 'A') {
                                                    productPrice = productPrice + (sectionAPrices[productDesignIndex] || 0);
                                                }
                                                if (vehicleCategory.name === 'B') {
                                                    productPrice = productPrice + (sectionBPrices[productDesignIndex] || 0);
                                                }
                                                if (vehicleCategory.name === 'C') {
                                                    productPrice = productPrice + (sectionCPrices[productDesignIndex] || 0);
                                                }
                                                const dataToSave = {
                                                    name: productName,
                                                    original_price: productPrice,
                                                    category_id: productCategory.id,
                                                    vehicle_details_id: vehicleDetail.id,
                                                    is_trending: true,
                                                    is_latest: true
                                                };
                                                const productDetail = await dao.createRow(constants.model_values.product.tableName, dataToSave);
                                                if (productDetail?.id) {
                                                    const productVariantToSave = {
                                                        product_id: productDetail.id,
                                                        design_id: design.id,
                                                        material_id: designMaterial.id,
                                                        major_color_id: majorColor.id
                                                    };
                                                    const productVariantDetail = await dao.createRow(constants.model_values.product_variants.tableName, productVariantToSave);
                                                    if (productVariantDetail?.id) {
                                                        const productVariantMinorColorsToSave = [];
                                                        for (let color of minorColors) {
                                                            if (color?.id) {
                                                                productVariantMinorColorsToSave.push({
                                                                    product_variant_id: productVariantDetail.id,
                                                                    minor_color_id: color.id,
                                                                });
                                                            }
                                                        }
                                                        await dao.createManyRows(constants.model_values.product_variant_minor_colors.tableName, productVariantMinorColorsToSave);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method setBrandModelVehicleTypes: set brand model vehicle types
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const setBrandModelVehicleTypes = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {
                // Check if file was uploaded
                if (!req.file) {
                    reject('please provide excel file');
                }

                // Read Excel file
                const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Extract data from sheet as columns
                const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                // Get column names
                const columnNames = data[0];

                // Get column data
                const columns = {};
                for (let i = 1; i < data.length; i++) {
                    for (let j = 0; j < columnNames.length; j++) {
                        const columnName = columnNames[j];
                        const cellValue = data[i][j];
                        columns[columnName] = columns[columnName] || [];
                        columns[columnName].push(cellValue);
                    }
                }

                const fields = data?.[0];
                if (!!fields.length) {
                    const brandIndex = fields.indexOf('Make');
                    const modelIndex = fields.indexOf('Model');
                    const vehicleTypeIndex = fields.indexOf("Vehicle Type");

                    for (let i = 1; i < data.length; i++) {
                        const vehicleDetails = data[i];
                        if (!!vehicleDetails.length) {
                            const brand = vehicleDetails[brandIndex] ? await dao.getRow(constants.model_values.brand.tableName, { name: vehicleDetails[brandIndex].trim() }) : null;
                            const model = vehicleDetails[modelIndex];
                            const vehicleType = vehicleDetails[vehicleTypeIndex] ? await dao.getRow(constants.model_values.vehicle_type.tableName, { name: vehicleDetails[vehicleTypeIndex].trim() }) : null;

                            const isValid = brand && model && vehicleType;

                            if (isValid) {
                                let brandModelDetail = await dao.getRow(
                                    constants.model_values.brand_model.tableName,
                                    { brand_id: brand.id, name: model }
                                );
                                if (brandModelDetail?.id) {
                                    await dao.updateRow(constants.model_values.brand_model.tableName, { id: brandModelDetail.id }, { vehicle_type_id: vehicleType.id });
                                    // console.log("brandModelDetail****", { vehicle_type_id: vehicleType.id });
                                }
                            }
                        }
                    }
                }

                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method uploadColors: uploading colors
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const uploadColors = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {
                // Check if file was uploaded
                if (!req.file) {
                    reject('please provide excel file');
                }

                // Read Excel file
                const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Extract data from sheet as columns
                const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                // Get column names
                const columnNames = data[0];

                // Get column data
                const columns = {};
                for (let i = 1; i < data.length; i++) {
                    for (let j = 0; j < columnNames.length; j++) {
                        const columnName = columnNames[j];
                        const cellValue = data[i][j];
                        columns[columnName] = columns[columnName] || [];
                        columns[columnName].push(cellValue);
                    }
                }

                const fields = data?.[0];
                if (!!(fields.length)) {
                    const colorIndex = fields.indexOf('Color');
                    const hexCodeIndex = fields.indexOf('Hex Code');

                    for (let i = 1; i < data.length; i++) {
                        const vehicleDetails = data[i];
                        if (!!vehicleDetails.length) {
                            const color = vehicleDetails[colorIndex] ? await dao.getRow(constants.model_values.color.tableName, { name: vehicleDetails[colorIndex].trim() }) : null;
                            const hexCode = vehicleDetails[hexCodeIndex];
                            if (color?.id) {
                                await dao.updateRow(constants.model_values.color.tableName, { id: color.id }, { hexadecimal_code: hexCode });
                            } else {
                                await dao.createRow(constants.model_values.color.tableName, { name: vehicleDetails[colorIndex].trim(), hexadecimal_code: hexCode });
                            }
                        }
                    }
                }

                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

export function updateProductName(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            const products = await dao.getRows({
                tableName: constants.model_values.product.tableName,
                attributes: ['id', 'vehicle_details_id'],
                include: [
                    {
                        model: db[constants.model_values.vehicle_detail.tableName],
                        attributes: ['brand_id', 'model_id', 'model_variant'],
                        required: true,
                        include: [
                            {
                                model: db[constants.model_values.brand.tableName],
                                attributes: ['name'],
                            },
                            {
                                model: db[constants.model_values.brand_model.tableName],
                                attributes: ['name'],
                            },
                        ]
                    },
                    {
                        model: db[constants.model_values.product_variants.tableName],
                        attributes: ['design_id'],
                        include: [
                            {
                                model: db[constants.model_values.design.tableName],
                                attributes: ['name'],
                            }
                        ]
                    }
                ]
            });
            if (!!(products?.length)) {
                for (const product of products) {
                    const designs = product.product_variants.map(pv => pv.design.name);
                    const productName = `${product.vehicle_detail.brand.name || ''} ${product.vehicle_detail.brand_model.name || ''} ${product.vehicle_detail.model_variant || ''} ${designs.join(', ') || ''}`.trim().replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
                    if (product.id && productName) {
                        await dao.updateRow(
                            constants.model_values.product.tableName,
                            { id: product.id },
                            { name: productName }
                        );
                    }
                }
            }
            return {};
        },
        constants.UPDATE_SUCCESS,
    );
};

/**
 * @method upload2WSheetCovers: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const upload2WSheetCovers = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            try {
                return new Promise(async (resolve, reject) => {
                    // Check if file was uploaded
                    if (!req.file) {
                        reject('please provide excel file');
                    }

                    // Read Excel file
                    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    // Extract data from sheet as columns
                    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                    // Get column names
                    const columnNames = data[0];

                    // Get column data
                    const columns = {};
                    for (let i = 1; i < data.length; i++) {
                        for (let j = 0; j < columnNames.length; j++) {
                            const columnName = columnNames[j];
                            const cellValue = data[i][j];
                            columns[columnName] = columns[columnName] || [];
                            columns[columnName].push(cellValue);
                        }
                    }

                    if (!!columns?.['Make']?.length) {
                        const uniqueMakes = [...new Set(columns['Make'])];
                        for (let make of uniqueMakes) {
                            console.log("make", make);
                            if (!!make) {
                                const isExists = await dao.getRow('brands', { name: make.trim() });
                                if (!isExists) {
                                    await dao.createRow('brands', { name: make.trim(), vehicle_type_id: 1 });
                                }
                            }
                        }

                        const models = columns?.['Model'] || [];
                        for (let i = 0; i < models.length; i++) {
                            const model = models[i]?.trim();
                            const brand = columns['Make']?.[i]?.trim();
                            if (model && brand) {
                                const isExistsBrand = await dao.getRow('brands', { name: brand });
                                if (isExistsBrand) {
                                    const isExists = await dao.getRow(constants.model_values.brand_model.tableName, { name: model });
                                    if (!isExists) {
                                        await dao.createRow(constants.model_values.brand_model.tableName, { name: model, brand_id: isExistsBrand.id, vehicle_type_id: 1 });
                                    }
                                }
                            }
                        }
                    }

                    const designs = columns?.['Design'] || [];
                    if (!!designs.length) {
                        const uniqueDesigns = [...new Set(designs)];
                        for (let design of uniqueDesigns) {
                            if (design) {
                                const isExists = await dao.getRow(constants.model_values.design.tableName, { name: design.trim() });
                                if (!isExists) {
                                    await dao.createRow(constants.model_values.design.tableName, { name: design.trim() });
                                }
                            }
                        }
                    }

                    const materials = columns?.['Design Material'] || [];
                    if (!!materials.length) {
                        const uniqueMaterials = [...new Set(materials)];
                        for (let material of uniqueMaterials) {
                            if (material) {
                                const isExists = await dao.getRow(constants.model_values.material.tableName, { name: material.trim() });
                                if (!isExists) {
                                    await dao.createRow(constants.model_values.material.tableName, { name: material.trim() });
                                }
                            }
                        }
                    }

                    const majorColors = columns?.['Major Color'] || [];
                    let colors = [...new Set(majorColors)];
                    const uniqueColors = [...new Set(colors)].map(color => titleCase(color));
                    if (!!uniqueColors.length) {
                        for (let color of uniqueColors) {
                            if (color) {
                                const isExists = await dao.getRow(constants.model_values.color.tableName, { name: color.trim() });
                                if (!isExists) {
                                    await dao.createRow(constants.model_values.color.tableName, { name: color.trim() });
                                }
                            }
                        }
                    }

                    const fields = data?.[0];
                    if (!!fields.length) {
                        const brandIndex = fields.indexOf('Make');
                        const modelIndex = fields.indexOf('Model');
                        const modelVariantIndex = fields.indexOf("Model Variant");
                        const vehicleTypeIndex = fields.indexOf("Vehicle Type");
                        const monthIndex = fields.indexOf("Month");
                        const yearIndex = fields.indexOf("Year");

                        // creating product variants
                        const designIndex = fields.indexOf('Design');
                        const designMaterialIndex = fields.indexOf('Design Material');
                        const productCategoryIndex = fields.indexOf('Product Category');
                        const majorColorIndex = fields.indexOf('Major Color');

                        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                        for (let i = 1; i < data.length; i++) {
                            const vehicleDetails = data[i];
                            if (!!vehicleDetails.length) {
                                const brand = vehicleDetails[brandIndex] ? await dao.getRow(constants.model_values.brand.tableName, { name: vehicleDetails[brandIndex].trim() }) : null;
                                const model = vehicleDetails[modelIndex] ? await dao.getRow(constants.model_values.brand_model.tableName, { name: vehicleDetails[modelIndex].trim() }) : null;
                                const modelVariant = vehicleDetails[modelVariantIndex];
                                const vehicleType = vehicleDetails[vehicleTypeIndex] ? await dao.getRow(constants.model_values.vehicle_type.tableName, { name: vehicleDetails[vehicleTypeIndex].trim() }) : null;
                                const month = vehicleDetails[monthIndex];
                                const year = vehicleDetails[yearIndex];

                                const isValid = brand && model && vehicleType;

                                if (isValid) {
                                    const dataToSave = {
                                        vehicle_type_id: vehicleType.id,
                                        brand_id: brand.id,
                                        model_id: model.id,
                                    };
                                    if (modelVariant) {
                                        dataToSave.model_variant = modelVariant;
                                    }
                                    if (month) {
                                        dataToSave.month = months.find(mth => mth.includes(month));
                                    }
                                    if (year) {
                                        dataToSave.year = year;
                                    }
                                    let vehicleDetail = await dao.getRow(constants.model_values.vehicle_detail.tableName, dataToSave);
                                    if (!(vehicleDetail?.id)) {
                                        vehicleDetail = await dao.createRow(constants.model_values.vehicle_detail.tableName, dataToSave);
                                    }
                                    if (vehicleDetail?.id) {
                                        const design = vehicleDetails[designIndex] ? await dao.getRow(constants.model_values.design.tableName, { name: vehicleDetails[designIndex].trim() }) : null;
                                        const designMaterial = vehicleDetails[designMaterialIndex] ? await dao.getRow(constants.model_values.material.tableName, { name: vehicleDetails[designMaterialIndex].trim() }) : null;
                                        const productCategory = vehicleDetails[productCategoryIndex] ? await dao.getRow(constants.model_values.product_category.tableName, { name: vehicleDetails[productCategoryIndex].trim() }) : null;
                                        const majorColor = vehicleDetails[majorColorIndex] ? await dao.getRow(constants.model_values.color.tableName, { name: vehicleDetails[majorColorIndex].trim() }) : null;

                                        if (design && designMaterial && productCategory && majorColor) {
                                            const productName = `${brand.name || ''} ${model.name || ''} ${modelVariant || ''} ${design.name || ''} Seat Cover`.trim().replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
                                            if (productName) {
                                                const dataToSave = {
                                                    name: productName,
                                                    original_price: 0,
                                                    category_id: productCategory.id,
                                                    vehicle_details_id: vehicleDetail.id,
                                                    is_trending: true,
                                                    is_latest: true
                                                };
                                                const productDetail = await dao.createRow(constants.model_values.product.tableName, dataToSave);
                                                if (productDetail?.id) {
                                                    const productVariantToSave = {
                                                        product_id: productDetail.id,
                                                        design_id: design.id,
                                                        material_id: designMaterial.id,
                                                        major_color_id: majorColor.id
                                                    };
                                                    await dao.createRow(constants.model_values.product_variants.tableName, productVariantToSave);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    resolve({});
                });
            } catch (error) {
                console.log("Qqq", error);
            }
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method replaceDesignPicturesWithImages: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export function replaceDesignPicturesWithImages(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            const designs = await dao.getRows({ tableName: constants.model_values.design.tableName });
            for (let design of designs) {
                if (!!design.image) {
                    // console.log('design', { id: design.id }, { pictures: [design.image] });
                    await dao.updateRow(constants.model_values.design.tableName, { id: design.id }, { pictures: [design.image] });
                }
            }
            return {};
        },
        constants.UPDATE_SUCCESS
    );
};

/**
 * @method uploadStores: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const uploadStores = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            try {
                return new Promise(async (resolve, reject) => {
                    // Check if file was uploaded
                    if (!req.file) {
                        reject('please provide excel file');
                    }

                    // Read Excel file
                    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    // Extract data from sheet as columns
                    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                    // Get column names
                    const columnNames = data[0];

                    // Get column data
                    const columns = {};
                    for (let i = 1; i < data.length; i++) {
                        for (let j = 0; j < columnNames.length; j++) {
                            const columnName = columnNames[j];
                            const cellValue = data[i][j];
                            columns[columnName] = columns[columnName] || [];
                            columns[columnName].push(cellValue);
                        }
                    }

                    const arr = [];
                    const stores = [];
                    const fields = data?.[0];
                    if (!!fields.length) {
                        const storeIndex = fields.indexOf('STORE NAME');
                        const addressIndex = fields.indexOf('ADDRESS');
                        const latIndex = fields.indexOf("Lan");
                        const longIndex = fields.indexOf("log");

                        for (let i = 1; i < data.length; i++) {
                            const storeDetails = data[i];
                            if (!!storeDetails.length) {
                                const store = storeDetails[storeIndex];
                                const address = storeDetails[addressIndex];
                                const lat = storeDetails[latIndex];
                                const long = storeDetails[longIndex];

                                const isValid = store && address && lat && long;

                                if (isValid) {
                                    const storeDataToSave = {
                                        name: titleCase(store)
                                    };
                                    let storeDetails = await dao.getRow(constants.model_values.store.tableName, storeDataToSave);
                                    if (!(storeDetails?.id)) {
                                        storeDetails = await dao.createRow(constants.model_values.store.tableName, storeDataToSave);
                                    }
                                    if (storeDetails?.id) {
                                        // Example usage:
                                        const addressObj = parseAddress(address);
                                        // arr.push({ [address]: addressObj });
                                        // stores.push(address);

                                        const storeAddressToSave = {
                                            street_address: titleCase(address),
                                            latitude: lat,
                                            longitude: long,
                                            country: 'India'
                                        };

                                        if (addressObj.city) {
                                            storeAddressToSave.city = titleCase(addressObj.city);
                                        }
                                        // if (addressObj.country) {
                                        //     storeAddressToSave.country = titleCase(addressObj.country);
                                        // }
                                        if (addressObj.state) {
                                            storeAddressToSave.state = titleCase(addressObj.state);
                                        }
                                        if (addressObj.pinCode) {
                                            storeAddressToSave.postal_code = titleCase(addressObj.pinCode);
                                        }

                                        // arr.push({ [address]: storeAddressToSave });
                                        arr.push(storeDataToSave);

                                        const storeAddress = await dao.getRow(constants.model_values.address.tableName, { store_id: storeDetails.id });
                                        if (!!(storeAddress?.id)) {
                                            await dao.updateRow(
                                                constants.model_values.address.tableName,
                                                { store_id: storeDetails.id },
                                                storeAddressToSave
                                            );
                                        } else {
                                            storeAddressToSave.store_id = storeDetails.id;
                                            await dao.createRow(constants.model_values.address.tableName, storeAddressToSave);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    resolve(arr);
                });
            } catch (error) {
                console.log("Error: ", error);
            }
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method uploadRandom: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const uploadRandom = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            try {
                return new Promise(async (resolve, reject) => {
                    // Check if file was uploaded
                    if (!req.file) {
                        reject('please provide excel file');
                    }

                    // Read Excel file
                    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    // Extract data from sheet as columns
                    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                    // Get column names
                    const columnNames = data[0];

                    // Get column data
                    const columns = {};
                    for (let i = 1; i < data.length; i++) {
                        for (let j = 0; j < columnNames.length; j++) {
                            const columnName = columnNames[j];
                            const cellValue = data[i][j];
                            columns[columnName] = columns[columnName] || [];
                            columns[columnName].push(cellValue);
                        }
                    }

                    const fields = data?.[0];
                    console.log(fields, "fields");

                    if (!!fields.length) {
                        const storeIndex = fields.indexOf('STORE NAME');
                        const emailIndex = fields.indexOf("Email Id's ");

                        for (let i = 1; i < data.length; i++) {
                            const storeDetails = data[i];
                            if (!!storeDetails.length) {
                                const store = storeDetails[storeIndex];
                                const email = storeDetails[emailIndex];

                                const isValid = store && store.trim() && email && email.trim();

                                if (isValid) {
                                    const storeDetails = await dao.getRow(
                                        constants.model_values.store.tableName,
                                        { name: titleCase(store.trim()) }
                                    );
                                    if (storeDetails?.id) {
                                        await dao.updateRow(
                                            constants.model_values.store.tableName,
                                            { id: storeDetails.id },
                                            { email: email.trim() }
                                        );

                                        // console.log(storeDetails.id, email);
                                    }
                                }
                            }
                        }
                    }
                    resolve();
                });
            } catch (error) {
                console.log("Error: ", error);
            }
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method uploadVehicleCategories: Read data from excel sheet and save in our database
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const uploadVehicleCategories = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            try {
                return new Promise(async (resolve, reject) => {
                    // Check if file was uploaded
                    if (!req.file) {
                        reject('please provide excel file');
                    }

                    // Read Excel file
                    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    // Extract data from sheet as columns
                    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                    // Get column names
                    const columnNames = data[0];

                    // Get column data
                    const columns = {};
                    for (let i = 1; i < data.length; i++) {
                        for (let j = 0; j < columnNames.length; j++) {
                            const columnName = columnNames[j];
                            const cellValue = data[i][j];
                            columns[columnName] = columns[columnName] || [];
                            columns[columnName].push(cellValue);
                        }
                    }

                    const categories = columns?.['Category'] || [];
                    if (!!categories.length) {
                        const uniqueCategories = [...new Set(categories)];
                        for (let i = 0; i < uniqueCategories.length; i++) {
                            const category = uniqueCategories[i]?.trim();
                            if (category) {
                                const isExists = await dao.getRow(constants.model_values.vehicle_category.tableName, { name: category });
                                if (!isExists) {
                                    await dao.createRow(constants.model_values.vehicle_category.tableName, { name: category });
                                }
                            }
                        }
                    }

                    const fields = data?.[0];
                    if (!!fields.length) {
                        const brandIndex = fields.indexOf('Make');
                        const modelIndex = fields.indexOf('Model');
                        const modelVariantIndex = fields.indexOf("Model Variant");
                        const vehicleTypeIndex = fields.indexOf("Vehicle Type");
                        const monthIndex = fields.indexOf("Month");
                        const yearIndex = fields.indexOf("Year");
                        const categoryIndex = fields.indexOf("Category");

                        // creating product variants
                        // const designIndex = fields.indexOf('Design');
                        // const designMaterialIndex = fields.indexOf('Design Material');
                        // const productCategoryIndex = fields.indexOf('Product Category');
                        // const majorColorIndex = fields.indexOf('Major Color');

                        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                        for (let i = 1; i < data.length; i++) {
                            const vehicleDetails = data[i];
                            if (!!vehicleDetails.length) {
                                const brand = vehicleDetails[brandIndex] ? await dao.getRow(constants.model_values.brand.tableName, { name: vehicleDetails[brandIndex].trim() }) : null;
                                const model = vehicleDetails[modelIndex] ? await dao.getRow(constants.model_values.brand_model.tableName, { name: vehicleDetails[modelIndex].trim() }) : null;
                                const modelVariant = vehicleDetails[modelVariantIndex];
                                const vehicleType = vehicleDetails[vehicleTypeIndex] ? await dao.getRow(constants.model_values.vehicle_type.tableName, { name: vehicleDetails[vehicleTypeIndex].trim() }) : null;
                                const month = vehicleDetails[monthIndex];
                                const year = vehicleDetails[yearIndex];
                                const vehicleCategory = vehicleDetails[categoryIndex] ? await dao.getRow(constants.model_values.vehicle_category.tableName, { name: vehicleDetails[categoryIndex].trim() }) : null;

                                const isValid = brand && model && vehicleType && vehicleCategory;

                                if (isValid) {
                                    const dataToSave = {
                                        vehicle_type_id: vehicleType.id,
                                        brand_id: brand.id,
                                        model_id: model.id,
                                    };
                                    if (modelVariant) {
                                        dataToSave.model_variant = modelVariant;
                                    }
                                    if (month) {
                                        dataToSave.month = months.find(mth => mth.includes(month));
                                    }
                                    if (year) {
                                        dataToSave.year = year;
                                    }
                                    const vehicleDetail = await dao.getRow(constants.model_values.vehicle_detail.tableName, dataToSave);
                                    if (!!(vehicleDetail?.id)) {
                                        await dao.updateRow(constants.model_values.vehicle_detail.tableName, { id: vehicleDetail.id }, { vehicle_category_id: vehicleCategory.id });
                                    }
                                    // if (vehicleDetail?.id) {
                                    //     const design = vehicleDetails[designIndex] ? await dao.getRow(constants.model_values.design.tableName, { name: vehicleDetails[designIndex].trim() }) : null;
                                    //     const designMaterial = vehicleDetails[designMaterialIndex] ? await dao.getRow(constants.model_values.material.tableName, { name: vehicleDetails[designMaterialIndex].trim() }) : null;
                                    //     const productCategory = vehicleDetails[productCategoryIndex] ? await dao.getRow(constants.model_values.product_category.tableName, { name: vehicleDetails[productCategoryIndex].trim() }) : null;
                                    //     const majorColor = vehicleDetails[majorColorIndex] ? await dao.getRow(constants.model_values.color.tableName, { name: vehicleDetails[majorColorIndex].trim() }) : null;

                                    //     if (design && designMaterial && productCategory && majorColor) {
                                    //         const productName = `${brand.name || ''} ${model.name || ''} ${modelVariant || ''} ${design.name || ''} Seat Cover`.trim().replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
                                    //         if (productName) {
                                    //             const dataToSave = {
                                    //                 name: productName,
                                    //                 original_price: 0,
                                    //                 category_id: productCategory.id,
                                    //                 vehicle_details_id: vehicleDetail.id,
                                    //                 is_trending: true,
                                    //                 is_latest: true
                                    //             };
                                    //             const productDetail = await dao.createRow(constants.model_values.product.tableName, dataToSave);
                                    //             if (productDetail?.id) {
                                    //                 const productVariantToSave = {
                                    //                     product_id: productDetail.id,
                                    //                     design_id: design.id,
                                    //                     material_id: designMaterial.id,
                                    //                     major_color_id: majorColor.id
                                    //                 };
                                    //                 await dao.createRow(constants.model_values.product_variants.tableName, productVariantToSave);
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                }
                            }
                        }
                    }
                    resolve();
                });
            } catch (error) {
                console.log("Error: ", error);
            }
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method update2WProductPrices: update 2W product prices
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const update2WProductPrices = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            try {
                const products = await dao.getRows({
                    tableName: constants.model_values.product.tableName,
                    attributes: ['id', 'name', 'vehicle_details_id'],
                    include: [{
                        model: db[constants.model_values.product_variants.tableName],
                        attributes: ['design_id'],
                        include: [
                            {
                                model: db[constants.model_values.design.tableName],
                                attributes: ['name'],
                                where: { name: { [Op.in]: ['U-IMPRESS', 'U-SPORTZ', 'U-ACTIVE', 'U-ACTIVE PLUS', 'U-DRIVE', 'U-CROSS'] } },
                                required: true,
                            },
                        ],
                        required: true
                    },
                    {
                        model: db[constants.model_values.vehicle_detail.tableName],
                        attributes: ['vehicle_category_id'],
                        where: { vehicle_category_id: { [Op.in]: [4, 5] } },
                        required: true,
                    }],
                    raw: true
                });
                if (!!(products.length)) {
                    for (let product of products) {
                        if (!!(product?.id)) {
                            let price;
                            if (product['product_variants.design.name'] === 'U-Impress') {
                                if (product["vehicle_detail.vehicle_category_id"] === 4) {
                                    if (!!(product.name?.toUpperCase().includes('ROYAL ENFIELD'))) {
                                        price = 625;
                                    } else {
                                        price = 345;
                                    }
                                } else if (product["vehicle_detail.vehicle_category_id"] === 5) {
                                    price = 395;
                                }
                            } else if (product['product_variants.design.name'] === 'U-SPORTZ') {
                                if (product["vehicle_detail.vehicle_category_id"] === 4) {
                                    price = 395;
                                } else if (product["vehicle_detail.vehicle_category_id"] === 5) {
                                    price = 435;
                                }
                            } else if (product['product_variants.design.name'] === 'U-ACTIVE') {
                                if (product["vehicle_detail.vehicle_category_id"] === 4) {
                                    price = 560;
                                } else if (product["vehicle_detail.vehicle_category_id"] === 5) {
                                    price = 660;
                                }
                            } else if (product['product_variants.design.name'] === 'U-ACTIVE PLUS') {
                                if (product["vehicle_detail.vehicle_category_id"] === 4) {
                                    price = 660;
                                } else if (product["vehicle_detail.vehicle_category_id"] === 5) {
                                    price = 765;
                                }
                            } else if (product['product_variants.design.name'] === 'U-DRIVE') {
                                if (product["vehicle_detail.vehicle_category_id"] === 4) {
                                    if (!!(product.name?.toUpperCase().includes('ROYAL ENFIELD'))) {
                                        price = 860;
                                    }
                                }
                            } else if (product['product_variants.design.name'] === 'U-CROSS') {
                                if (product["vehicle_detail.vehicle_category_id"] === 4) {
                                    if (!!(product.name?.toUpperCase().includes('ROYAL ENFIELD'))) {
                                        price = 1040;
                                    }
                                }
                            }
                            if (!!price) {
                                // product.updatedPrice = price;
                                await dao.updateRow(constants.model_values.product.tableName, { id: product.id }, { original_price: price });
                            }
                        }
                    }
                }
                return { len: products.length, products };
            } catch (error) {
                console.log("Error: ", error);
            }
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method updateProductPictures: update product pictures
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const updateProductPictures = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            try {
                const products = await dao.getRows({
                    tableName: constants.model_values.product.tableName,
                    attributes: ['id', 'name'],
                    include: [{
                        model: db[constants.model_values.product_variants.tableName],
                        // where: { major_color_id: 1 },
                        include: [
                            {
                                model: db[constants.model_values.design.tableName],
                                attributes: ['name'],
                                where: { name: { [Op.in]: ['U-Impress'] } },
                                required: true,
                            },
                        ],
                        required: true
                    },
                    {
                        model: db[constants.model_values.vehicle_detail.tableName],
                        where: {
                            vehicle_type_id: 1,
                            vehicle_category_id: 4,
                            // brand_id: 18
                        },
                        required: true,
                    }
                    ],
                    raw: true
                });
                const arr = [];
                const pictures = [
                    "https://balonkun.s3.ap-south-1.amazonaws.com/autoform/products/images/Two+Wheeler/U-IMPRESS-Bike.jpeg",
                ];
                if (!!(products.length)) {
                    for (let product of products) {
                        if (!!(product?.id)) {
                            arr.push(product.name);
                            // await dao.updateRow(constants.model_values.product.tableName, { id: product.id }, { pictures });
                        }
                    }
                }
                return arr;
            } catch (error) {
                console.log("Error: ", error);
            }
        },
        constants.CREATION_SUCCESS
    );
};

/**
 * @method readSeatCoverPrices: read seat cover prices
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const readSeatCoverPrices = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            try {
                return new Promise(async (resolve, reject) => {
                    // Check if file was uploaded
                    if (!req.file) {
                        reject('please provide excel file');
                    }

                    // Read Excel file
                    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    // Extract data from sheet as columns
                    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

                    // Get column names
                    const columnNames = data[0];

                    // Get column data
                    const columns = {};
                    for (let i = 1; i < data.length; i++) {
                        for (let j = 0; j < columnNames.length; j++) {
                            const columnName = columnNames[j];
                            const cellValue = data[i][j];
                            columns[columnName] = columns[columnName] || [];
                            columns[columnName].push(cellValue);
                        }
                    }

                    const fields = data?.[0];
                    // const arr = [];
                    if (!!fields.length) {
                        const designNameIndex = fields.indexOf('Design Name');
                        const basePriceIndex = fields.indexOf('Base Price');
                        const sectionAIndex = fields.indexOf('Section A');
                        const sectionBIndex = fields.indexOf('Section B');
                        const sectionCIndex = fields.indexOf('Section C');

                        for (let i = 1; i < data.length; i++) {
                            const details = data[i];
                            if (!!details.length) {
                                const designName = details[designNameIndex] ?
                                    await dao.getRow(constants.model_values.design.tableName, { name: details[designNameIndex].trim() }) : null;
                                const basePrice = details[basePriceIndex] || 0;
                                const sectionA = details[sectionAIndex] || 0;
                                const sectionB = details[sectionBIndex] || 0;
                                const sectionC = details[sectionCIndex] || 0;

                                if (designName?.id && basePrice && sectionA && sectionB && sectionC) {
                                    // arr.push(
                                    //     { design: designName, vehicle_category: 'A', base_price: parseInt(basePrice), price: parseInt(sectionA) },
                                    //     { design: designName, vehicle_category: 'B', base_price: parseInt(basePrice), price: parseInt(sectionB) },
                                    //     { design: designName, vehicle_category: 'C', base_price: parseInt(basePrice), price: parseInt(sectionC) }
                                    // );
                                    await dao.createManyRows(
                                        constants.model_values.product_price.tableName,
                                        [
                                            { design_id: designName.id,
                                                vehicle_category_id: 1,
                                                base_price: parseInt(basePrice),
                                                design_price: parseInt(sectionA) },
                                            { design_id: designName.id,
                                                vehicle_category_id: 2,
                                                base_price: parseInt(basePrice),
                                                design_price: parseInt(sectionB) },
                                            { design_id: designName.id,
                                                vehicle_category_id: 3,
                                                base_price: parseInt(basePrice),
                                                design_price: parseInt(sectionC) }
                                        ]
                                    );
                                }
                            }
                        }
                    }

                    const twoWheelerPrices = [
                        { design: "U-Impress", vehicle_category: "Bike", brand: "", price: 345 },
                        { design: "U-Impress", vehicle_category: "Scooter", brand: "", price: 395 },
                        { design: "U-Impress", vehicle_category: "Bike", brand: "ROYAL ENFIELD", price: 625 },

                        { design: "U-SPORTZ", vehicle_category: "Bike", brand: "", price: 395 },
                        { design: "U-SPORTZ", vehicle_category: "Scooter", brand: "", price: 435 },

                        { design: "U-ACTIVE", vehicle_category: "Bike", brand: "", price: 560 },
                        { design: "U-ACTIVE", vehicle_category: "Scooter", brand: "", price: 660 },

                        { design: "U-ACTIVE PLUS", vehicle_category: "Bike", brand: "", price: 660 },
                        { design: "U-ACTIVE PLUS", vehicle_category: "Scooter", brand: "", price: 765 },

                        { design: 'U-DRIVE', vehicle_category: "Bike", brand: "ROYAL ENFIELD", price: 860 },

                        { design: 'U-CROSS', vehicle_category: "Bike", brand: "ROYAL ENFIELD", price: 1040 },
                    ];

                    for (let item of twoWheelerPrices) {
                        const designName = item.design ? await dao.getRow(constants.model_values.design.tableName, { name: item.design.trim() }) : null;
                        const vehicle_category = item.vehicle_category ? await dao.getRow(constants.model_values.vehicle_category.tableName, { name: item.vehicle_category.trim() }) : null;
                        const brand = item.brand ? await dao.getRow(constants.model_values.brand.tableName, { name: item.brand.trim() }) : null;

                        if (designName?.id && vehicle_category?.id && item.price) {
                            await dao.createRow(
                                constants.model_values.product_price.tableName,
                                { design_id: designName.id, vehicle_category_id: vehicle_category.id, brand_id: brand?.id || 0, design_price: parseInt(item.price) },
                            );
                        }
                    }

                    resolve();
                });
            } catch (error) {
                console.log("Error: ", error);
            }
        },
        constants.CREATION_SUCCESS
    );
};
