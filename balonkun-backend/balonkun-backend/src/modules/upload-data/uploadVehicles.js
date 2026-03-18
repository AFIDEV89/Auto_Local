"use strict";
import xlsx from 'xlsx';
import * as validations from '../../common/joi.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import db from "../../database/index.js";


function  getImagePath(image) {
    console.log(encodeURIComponent(image))
    return "https://balonkun.s3.amazonaws.com/products/"+ encodeURIComponent(image)+".jpg"
}
export const uploadPictures = async (req, res) => {
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
                                required: true,
                            },
                            {
                                model: db[constants.model_values.color.tableName],
                                attributes: ['name'],
                                required: true,

                            }
                        ],
                        required: true
                    },
                        {
                            model: db[constants.model_values.vehicle_detail.tableName],
                            include: [
                                {
                                    model: db[constants.model_values.vehicle_type.tableName],
                                    attributes: ['name'],
                                    required: true,
                                }
                                ],
                            required: true,
                        }
                    ],
                    raw: true
                });

                let productIds = []
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                   // console.log(product)
                    let object = {
                        "product_id": product.id,
                        "design":product['product_variants.design.name'],
                        "major_color":product['product_variants.color.name'],
                        "vehicle_type":product['vehicle_detail.vehicle_type.name']
                    }
                    productIds.push(object)
                }


                let totalItems  =  columns['S No.']
                //console.log(totalItems.length)
                let alreadyUpdatedId = []
                for(let i = 0;i<totalItems.length;i++) {
                    let design = columns['Design'][i]
                    let major_color = columns['Major Color'][i]
                    let vehicle_type = columns['Vehicle Type'][i]
                    let image_1 = getImagePath(columns['Image name 1'][i])
                    let image_2 = getImagePath(columns['Image name 2'][i])
                    let image_3 = getImagePath(columns['Image name 3'][i])
                    let image_4 = getImagePath(columns['Image name 4'][i])
                    let image_5 = getImagePath(columns['Image name 5'][i])
                    let imagearray=[]
                    if(image_1) {
                        imagearray.push(image_1)
                    }
                    if(image_2) {
                        imagearray.push(image_2)
                    }
                    if(image_3) {
                        imagearray.push(image_3)
                    }
                    if(image_4) {
                        imagearray.push(image_4)
                    }
                    if(image_5) {
                        imagearray.push(image_5)
                    }
                    let ids = productIds.filter(object=> object.design === design && object.major_color === major_color
                        && object.vehicle_type === vehicle_type)

                   // console.log("matching ids "+ids)
                    for(let ii =0;ii<ids.length;ii++) {

                        let id = ids[ii]['product_id']
                    //    console.log(id)
                      //  console.log("alreadyupdatedids "+ alreadyUpdatedId)
                        let exist = false
                        for(let iii = 0; iii<alreadyUpdatedId.length;iii++) {
                          //  console.log("alreadyUpdatedId[iii]" +alreadyUpdatedId[iii])
                            //console.log("id" +id)

                            if(alreadyUpdatedId[iii]===id) {
                              //  console.log("existed")
                                exist = true
                                break;
                            }
                        }
                        if(!exist) {
                          //  console.log("chekcin id " + id)
                            alreadyUpdatedId.push(id)
                            // console.log("updating "+id)
                            // console.log("updating "+JSON.stringify(imagearray))
                            await updateImage(id,  imagearray)
                        }
                    }
                }
                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};
async function updateImage(id,image) {
    await dao.updateRow(constants.model_values.product.tableName, {id:id}, { pictures:image});

}

export const changePicturePaths = async (req, res) => {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {
                // Check if file was uploaded


                const products = await dao.getRows({
                    tableName: constants.model_values.product.tableName,
                    attributes: ['id', 'name','pictures'],
                    include: [{
                        model: db[constants.model_values.product_variants.tableName],
                        // where: { major_color_id: 1 },
                        include: [
                            {
                                model: db[constants.model_values.design.tableName],
                                attributes: ['name'],
                                required: true,
                            },
                            {
                                model: db[constants.model_values.color.tableName],
                                attributes: ['name'],
                                required: true,

                            }
                        ],
                        required: true
                    },
                        {
                            model: db[constants.model_values.vehicle_detail.tableName],
                            include: [
                                {
                                    model: db[constants.model_values.vehicle_type.tableName],
                                    attributes: ['name'],
                                    required: true,
                                }
                            ],
                            required: true,
                        }
                    ],
                    raw: true
                });

                console.log(products)
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    // console.log(product)
                    let id = product.id;
                    let pictures = product.pictures;
                    if(pictures) {
                        await updateImage(id, JSON.parse(pictures))
                    }
                }



                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};


export const upload2wPictures = async (req, res) => {
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
                                required: true,
                            },
                        ],
                        required: true
                    },
                        {
                            model: db[constants.model_values.vehicle_detail.tableName],
                            where: {
                                vehicle_type_id: 1,
                                // vehicle_category_id: 4,
                                // brand_id: 18
                            },
                            required: true,
                        }
                    ],
                    raw: true
                });

                console.log(products)
                let productIds = []
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    // console.log(product)
                    let object = {
                        "product_id": product.id,
                    }
                    productIds.push(object)
                }


                let totalItems  =  columns['id']
                //console.log(totalItems.length)
                let alreadyUpdatedId = []
                for(let i = 0;i<totalItems.length;i++) {
                    let id = columns['id'][i]

                    let imagearray=columns['pictures'][i]

                    let ids = productIds.filter(object=> object.product_id=== id)
                    console.log(ids)
                    // console.log("matching ids "+ids)
                    for(let ii =0;ii<ids.length;ii++) {

                        let id = ids[ii]['product_id']
                        //    console.log(id)
                        //  console.log("alreadyupdatedids "+ alreadyUpdatedId)
                        let exist = false
                        for(let iii = 0; iii<alreadyUpdatedId.length;iii++) {
                            //  console.log("alreadyUpdatedId[iii]" +alreadyUpdatedId[iii])
                            //console.log("id" +id)

                            if(alreadyUpdatedId[iii]===id) {
                                //  console.log("existed")
                                exist = true
                                break;
                            }
                        }
                        if(!exist && imagearray) {
                            //  console.log("chekcin id " + id)
                            alreadyUpdatedId.push(id)
                            console.log("updating "+id)
                            console.log("image "+imagearray)
                            await updateImage(id, JSON.parse(imagearray))
                        }
                    }
                }
                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

export const uploadAccessMatsPictures = async (req, res) => {
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

                const products = await dao.getRows({
                    tableName: constants.model_values.product.tableName,
                    attributes: ['id', 'name','category_id'],
                    query: {
                        category_id: 3,
                        // vehicle_category_id: 4,
                        // brand_id: 18
                    },
                    raw: true
                });
                console.log(products)
                let productIds = []
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    // console.log(product)
                    let object = {
                        "product_id": product.id,
                    }
                    productIds.push(object)
                }


                let totalItems  =  columns['id']
                //console.log(totalItems.length)
                let alreadyUpdatedId = []
                for(let i = 0;i<totalItems.length;i++) {
                    let id = columns['id'][i]

                    let imagearray=columns['pictures'][i]

                    let ids = productIds.filter(object=> object.product_id=== id)
                    console.log(ids)
                    // console.log("matching ids "+ids)
                    for(let ii =0;ii<ids.length;ii++) {

                        let id = ids[ii]['product_id']
                        //    console.log(id)
                        //  console.log("alreadyupdatedids "+ alreadyUpdatedId)
                        let exist = false
                        for(let iii = 0; iii<alreadyUpdatedId.length;iii++) {
                            //  console.log("alreadyUpdatedId[iii]" +alreadyUpdatedId[iii])
                            //console.log("id" +id)

                            if(alreadyUpdatedId[iii]===id) {
                                //  console.log("existed")
                                exist = true
                                break;
                            }
                        }
                        if(!exist && imagearray) {
                            //  console.log("chekcin id " + id)
                            alreadyUpdatedId.push(id)
                            console.log("updating "+id)
                            console.log("image "+imagearray)
                            await updateImage(id, JSON.parse(imagearray))
                        }
                    }
                }
                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

export const uploadDescriptionAdditionalInfo = async (req, res) => {
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



                let totalItems  =  columns['id']
                //console.log(totalItems.length)
                let alreadyUpdatedId = []
                for(let i = 0;i<totalItems.length;i++) {
                    let id = columns['id'][i]

                    let description=columns['description'][i]
                    let additional_info=columns['additional_info'][i]
                   // console.log(id,description,additional_info)
                     await dao.updateRow(constants.model_values.product.tableName, {id:id}, { description,additional_info});


                }
                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

export const deleteProducts = async (req, res) => {
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


                let product_delete = req.query.name
                console.log(product_delete)
                const products = await dao.getRows({
                    tableName: constants.model_values.product.tableName,
                    attributes: ['id', 'name','pictures'],
                    include: [{
                        model: db[constants.model_values.product_variants.tableName],
                        // where: { major_color_id: 1 },
                        include: [
                            {
                                model: db[constants.model_values.design.tableName],
                                attributes: ['name'],
                                where:{
                                    name:product_delete
                                },
                                required: true,
                            },
                            {
                                model: db[constants.model_values.color.tableName],
                                attributes: ['name'],
                                required: true,

                            }
                        ],
                        required: true
                    },
                        {
                            model: db[constants.model_values.vehicle_detail.tableName],
                            include: [
                                {
                                    model: db[constants.model_values.vehicle_type.tableName],
                                    attributes: ['name'],
                                    required: true,
                                }
                            ],
                            required: true,
                        }
                    ],
                    raw: true
                });


                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    // console.log(product)
                    if(!product.pictures) {
                        await dao.deleteRow(constants.model_values.product_variant_minor_colors.tableName, {product_variant_id:product['product_variants.id']});
                        await dao.deleteRow(constants.model_values.product_variants.tableName, {product_id:product.id});
                        await dao.deleteRow(constants.model_values.cart.tableName, {product_id:product.id});
                        await dao.deleteRow(constants.model_values.orderProduct.tableName, {product_id:product.id});
                        await dao.deleteRow(constants.model_values.product.tableName, {id:product.id});
                        console.log(product.id)
                    }
                }


                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};