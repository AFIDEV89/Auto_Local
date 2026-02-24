
"use strict";
import sequelize from "sequelize";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import * as productDao from "../../database/dao/productDao.js";
import db from "../../database/index.js";
import * as Utils from "../../utils/index.js";
import * as Validator from './ProductValidations.js';
import xlsx from "xlsx";
import {parseDataToColumns} from "../upload-data/Utils.js";
import {createBulkUpload, uploadSingleEntry} from "./bulk_product_upload/ProductUploadBulk.js";

const {Op} = sequelize;


/**
 * @method CreateProduct: To add new product
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createProduct(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createProduct,
        async () => {
            // creating vehicle details
            let vehicleDetail = await dao.getRow(constants.model_values.vehicle_detail.tableName, req.body.vehicle_detail);
            if (!(vehicleDetail?.id)) {
                vehicleDetail = await dao.createRow(constants.model_values.vehicle_detail.tableName, req.body.vehicle_detail);
            }

            if (!(vehicleDetail?.id)) {
                return {};
            }

            // creating product details
            const productToSave = {...req.body, vehicle_details_id: vehicleDetail.id};
            delete productToSave.vehicle_details;
            const result = await dao.createRow(constants.model_values.product.tableName, productToSave);

            // creating product variants
            if (result?.id) {
                if (!!(req.body.variants?.length)) {
                    await productDao.createProductVariants(result.id, req.body.variants);
                }
                return dao.getRow(constants.model_values.product.tableName, {id: result.id});
            }

            return {};
        },
        constants.CREATION_SUCCESS,
        messages.products.create
    );
};

/**
 * @method updateProduct: To update existing product
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateProduct(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateProduct,
        async () => {
            const result = await dao.updateRow(constants.model_values.product.tableName, {id: req.params.id}, req.body);
            if (result[0]) {
                await productDao.updateProductVariants(parseInt(req.params.id), req.body.variants);
            }
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.products.update
    );
};

/**
 * @method getProductGallery: To get list of images for product
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getProductGallery(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getProductGallery,
        async () => {
            const productResult = await dao.getRow(
                constants.model_values.product.tableName,
                {id: req.params.id},
                null,
                ['pictures']
            );
            const reviewResult = await dao.getRows({
                tableName: constants.model_values.review.tableName,
                query: {product_id: req.params.id},
                attributes: ['image']
            });

            let result = [];
            if (!!(productResult)) {
                result = productResult;
            }
            if (!!(reviewResult?.length)) {
                result = result.concat(reviewResult);
            }

            return result;
        },
        constants.GET_SUCCESS,
        messages.products.get_list
    );
};

/**
 * @method getProductList: To get product list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getProductList(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getProductList,
        async () => {
            const {search, filter_type, filter_id, page, limit} = req.query;
            const cond = {};
            const productVehicleDetailInclude = {model: db[constants.model_values.vehicle_detail.tableName]};

            switch (filter_type) {
                // For two/four wheeler products
                case constants.model_values.product.admin_listing_filters.vehicle_type: {
                    productVehicleDetailInclude.where = {vehicle_type_id: filter_id};
                    cond[Op.or] = [
                        {vehicle_type_id: filter_id},
                        {vehicle_type_id: {[Op.eq]: null}},
                        {vehicle_type_id: {[Op.eq]: 0}}
                    ];
                    break;
                }
                // For product categories
                case constants.model_values.product.admin_listing_filters.product_category: {
                    cond.category_id = filter_id;
                    break;
                }
            }

            if (search) {
                cond.name = {[Op.like]: `%${search}%`};
                // cond.detail = { [Op.like]: '%' + search.replace(/_/g, ' ') + '%' };
                // cond.description = { [Op.like]: '%' + search.replace(/_/g, ' ') + '%' };
                // const fields = ['name', 'detail', 'description'];
                // const fields = ['name'];
                // cond[Op.or] = fields.map(field => ({
                //   [field]: {
                //     [Op.like]: `%${search}%`
                //   }
                // }));
                // cond.name = { [Op.ne]: null };
                // cond.detail = { [Op.ne]: null };
                // cond.description = { [Op.ne]: null };
                // { name: { [Op.like]: '%' + search.replace(/_/g, ' ') + '%' } },
                // { detail: { [Op.like]: '%' + search.replace(/_/g, ' ') + '%' } },
                // { description: { [Op.like]: '%' + search.replace(/_/g, ' ') + '%' } }
            }

            const result = await dao.getRows({
                tableName: constants.model_values.product.tableName,
                query: cond,
                include: [
                    productVehicleDetailInclude,
                    {model: db[constants.model_values.product_category.tableName]},
                    {model: db[constants.model_values.brand.tableName]},
                    {
                        model: db[constants.model_values.product_variants.tableName],
                        attributes: ['design_id'],
                        include: [
                            {
                                model: db[constants.model_values.design.tableName],
                                // TODO: in future we will remove image
                                attributes: ['image', 'pictures'],
                            },
                        ]
                    },
                ],
                order: [['updatedAt', 'DESC']],
                page: page,
                limit: limit,
            });

            // console.log("cond***", result.length);
            return result;
        },
        constants.GET_SUCCESS,
        messages.products.get_list
    );
};

/**
 * @method deleteProduct: To delete existing product
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteProduct(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteProduct,
        async () => {
            const id = parseInt(req.params.id);
            await productDao.deleteProductVariants(id);
            return dao.deleteRow(constants.model_values.product.tableName, {id});
        },
        constants.DELETE_SUCCESS,
        messages.products.delete
    );
};

/**
 * @method getProduct: To get product details
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getProduct(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getProduct,
        async () => {
            const product = await dao.getRow(
                constants.model_values.product.tableName,
                {id: req.params.id},
                [
                    {model: db[constants.model_values.product_category.tableName]},
                    {
                        model: db[constants.model_values.product_variants.tableName],
                        include: [
                            {
                                model: db[constants.model_values.color.tableName],
                            },
                            {
                                model: db[constants.model_values.material.tableName],
                            },
                            {
                                model: db[constants.model_values.design.tableName],
                            },
                            {
                                model: db[constants.model_values.product_variant_minor_colors.tableName],
                                include: [{model: db[constants.model_values.color.tableName]}]
                            }
                        ]
                    },
                    {model: db[constants.model_values.brand.tableName]},
                    {
                        model: db[constants.model_values.vehicle_detail.tableName],
                        attributes: ['vehicle_type_id', 'brand_id', 'model_id', 'model_variant', 'vehicle_category_id']
                    },
                ]
            );
            if (Utils.isObject(product)) {
                const result = Utils.createCopy(product);
                if (Utils.isArray(product.product_minor_colors)) {
                    result.minor_colors = product.product_minor_colors.map(pColor => pColor.color.id);
                    delete result.product_minor_colors;
                }
                if (Utils.isArray(product.product_major_colors)) {
                    result.major_colors = product.product_major_colors.map(pColor => pColor.color.id);
                    delete result.product_major_colors;
                }
                if (Utils.isArray(product.product_materials)) {
                    result.materials = product.product_materials.map(pMaterial => pMaterial.material.id);
                    delete result.product_materials;
                }
                if (product.category_id) {
                    const relatedProducts = await dao.getRows({
                        tableName: constants.model_values.product.tableName,
                        query: {category_id: product.category_id},
                        include: [
                            {model: db[constants.model_values.product_category.tableName]},
                            {model: db[constants.model_values.brand.tableName]},
                            {
                                model: db[constants.model_values.product_variants.tableName],
                                attributes: ['design_id'],
                                include: [
                                    {
                                        model: db[constants.model_values.design.tableName],
                                        // TODO: in future we will remove image
                                        attributes: ['image', 'pictures'],
                                    },
                                ]
                            }
                        ],
                        page: 1,
                        limit: 10
                    });
                    if (Utils.isArray(relatedProducts)) {
                        result.related_products = relatedProducts;
                    }
                }
                return result;
            } else {
                return {};
            }
        },
        constants.GET_SUCCESS,
        messages.products.get
    );
};

/**
 * @method bulkCreateProduct: To add multiple new products
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getUserProduct(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getUserProduct,
        async () => {
            let query = {};
            if (!Number(req.params.id)) {
                query = {seo_canonical: req.params.id}
            } else {
                query = {id: req.params.id}
            }
            const product = await productDao.getWishlistProductDetails({
                query: query,
                include: [
                    {model: db[constants.model_values.product_category.tableName]},
                    {
                        model: db[constants.model_values.product_variants.tableName],
                        include: [
                            {
                                model: db[constants.model_values.color.tableName],
                            },
                            {
                                model: db[constants.model_values.material.tableName],
                            },
                            {
                                model: db[constants.model_values.design.tableName],
                            },
                            {
                                model: db[constants.model_values.product_variant_minor_colors.tableName],
                                include: [{model: db[constants.model_values.color.tableName]}]
                            }
                        ]
                    },
                    {model: db[constants.model_values.brand.tableName]},
                    {
                        model: db[constants.model_values.vehicle_detail.tableName],
                        attributes: ['vehicle_type_id', 'brand_id', 'model_id'],
                        include: [
                            {model: db[constants.model_values.brand.tableName], attributes: ['name']},
                            {model: db[constants.model_values.brand_model.tableName], attributes: ['name']}
                        ]
                    },
                ],
                user_id: req.query.user_id
            });
            if (Utils.isObject(product)) {
                const result = Utils.createCopy(product);
                if (Utils.isArray(product.product_minor_colors)) {
                    result.minor_colors = product.product_minor_colors.map(pColor => pColor.color.id);
                    delete result.product_minor_colors;
                }
                if (Utils.isArray(product.product_major_colors)) {
                    result.major_colors = product.product_major_colors.map(pColor => pColor.color.id);
                    delete result.product_major_colors;
                }
                if (Utils.isArray(product.product_materials)) {
                    result.materials = product.product_materials.map(pMaterial => pMaterial.material.id);
                    delete result.product_materials;
                }
                // if (product.category_id) {
                //   const relatedProducts = await dao.getRows({
                //     tableName: constants.model_values.product.tableName,
                //     query: { category_id: product.category_id },
                //     include: [
                //       { model: db[constants.model_values.product_category.tableName] },
                //       { model: db[constants.model_values.brand.tableName] },
                //       {
                //         model: db[constants.model_values.product_variants.tableName],
                //         attributes: ['design_id'],
                //         include: [
                //           {
                //             model: db[constants.model_values.design.tableName],
                // TODO: in future we will remove image
                //             attributes: ['image', 'pictures'],
                //           },
                //         ]
                //       }
                //     ],
                //     page: 1,
                //     limit: 12
                //   });
                //   if (relatedProducts?.list && Utils.isArray(relatedProducts.list)) {
                //     result.related_products = relatedProducts.list;
                //   }
                // }
                return result;
            } else {
                return {};
            }
        },
        constants.GET_SUCCESS,
        messages.products.get
    );
};


/**
 * @method bulkCreateProduct: To add multiple new products
 * @param {Object} req request object
 * @param {Object} res response object
 */
function bulkCreateProduct(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            return new Promise(async (resolve, reject) => {
                    if (!req.file) {
                        reject('please provide excel file');
                    }

                    // Read Excel file
                    const workbook = xlsx.read(req.file.buffer, {type: 'buffer'});
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    // Extract data from sheet as columns
                    const data = xlsx.utils.sheet_to_json(sheet, {header: 1});
                    await createBulkUpload(parseDataToColumns(data))
                }
            );
        })
}

    /**
     * @method getFilters: To get product filters
     * @param {Object} req request object
     * @param {Object} res response object
     */
    function getFilters(req, res) {
        return validations.validateSchema(
            req,
            res,
            null,
            () => {
                return Promise.all([
                    dao.getRows({
                        tableName: constants.model_values.brand.tableName,
                        attributes: [['id', 'dbId'], ['name', 'title'], 'vehicle_type_id']
                    }),
                    dao.getRows({
                        tableName: constants.model_values.brand_model.tableName,
                        attributes: [['id', 'dbId'], ['name', 'title'], 'brand_id', 'vehicle_type_id']
                    }),
                    dao.getRows({
                        tableName: constants.model_values.product_category.tableName,
                        attributes: [['id', 'dbId'], ['name', 'title']]
                    }),
                    dao.getRows({
                        tableName: constants.model_values.vehicle_type.tableName,
                        attributes: [['id', 'dbId'], ['name', 'title']]
                    }),
                    dao.getRows({
                        tableName: constants.model_values.design.tableName,
                        attributes: [['id', 'dbId'], ['name', 'title']]
                    }),
                    dao.getRows({
                        tableName: constants.model_values.material.tableName,
                        attributes: [['id', 'dbId'], ['name', 'title']]
                    }),
                    dao.getRows({
                        tableName: constants.model_values.color.tableName,
                        attributes: [['id', 'dbId'], ['name', 'title'], ['hexadecimal_code', 'hex_code']]
                    }),
                ]).then(result => {
                    return {
                        title: 'All Filters',
                        subTitle: 'Product patterns',
                        list: [
                            {
                                title: 'Vehicle Types',
                                list: result[3]
                            },
                            {
                                title: 'Vehicle Brands',
                                list: result[0]
                            },
                            {
                                title: 'Vehicle Models',
                                list: result[1]
                            },
                            {
                                title: 'Product Categories',
                                list: result[2]
                            },
                            {
                                title: 'Product Designs',
                                list: result[4]
                            },
                            {
                                title: 'Product Materials',
                                list: result[5]
                            },
                            {
                                title: 'Major Colors',
                                list: result[6]
                            },
                            {
                                title: 'Minor Colors',
                                list: result[6]
                            },
                        ]
                    };
                });
            },
            constants.GET_SUCCESS,
            messages.products.get_filters
        );
    };

    /**
     * @method getUserProductList: To get product list
     * @param {Object} req request object
     * @param {Object} res response object
     */
    function getUserProductList(req, res) {
        return validations.validateSchema(
            req,
            res,
            Validator.getUserProductList,
            async () => {
                const {search, filters, sort_by, sort_order, filter_by, user_id, page, limit} = req.body;
                const cond = {};
                if (search?.toLowerCase() === 'trending') {
                    cond.is_trending = true;
                }
                if (filter_by === 'latest') {
                    cond.is_latest = true;
                }

                const productVehicleDetailInclude = {
                    model: db[constants.model_values.vehicle_detail.tableName],
                    attributes: ['brand_id', 'model_id', 'vehicle_type_id']
                };

                // query for vehicle details
                if (filters && !!(Object.keys(filters)?.length)) {
                    const vehicleDetailQuery = {};

                    // checking product category valid for all vehicle brand and models
                    let isValidForAllVehicleProducts = true;
                    if (!!(filters.product_categories?.length)) {
                        const products = await productDao.getUnHideProducts({
                            query: {category_id: {[Op.in]: filters.product_categories}},
                            attributes: ['vehicle_details_id'],
                            raw: true
                        });
                        if (Utils.isNonEmptyArray(products)) {
                            const vehicleDetailsIds = products.map(prod => prod.vehicle_details_id);
                            const vehicleDetails = await dao.getRows({
                                tableName: constants.model_values.vehicle_detail.tableName,
                                query: {id: {[Op.in]: Utils.findUniqueValues(vehicleDetailsIds)}},
                                attributes: ['brand_id', 'model_id'],
                                raw: true
                            });
                            if (Utils.isNonEmptyArray(vehicleDetails)) {
                                // Extract unique brand_id values greater than 0
                                const uniqueBrandIds = [...new Set(vehicleDetails.filter(item => item.brand_id > 0).map(item => item.brand_id))];

                                // Extract unique model_id values greater than 0
                                const uniqueModelIds = [...new Set(vehicleDetails.filter(item => item.model_id > 0).map(item => item.model_id))];

                                isValidForAllVehicleProducts = Utils.isNonEmptyArray(uniqueBrandIds) || Utils.isNonEmptyArray(uniqueModelIds);
                            }
                        }
                    }
                    if (filters.product_categories?.length === 1 && (filters.product_categories[0] === 2 || filters.product_categories[0] === 3)) {
                        isValidForAllVehicleProducts = false
                    }

                    if (isValidForAllVehicleProducts) {
                        if (!!(filters.vehicle_brands?.length)) {
                            vehicleDetailQuery.brand_id = {[Op.in]: filters.vehicle_brands};
                        }
                        if (!!(filters.vehicle_models?.length)) {
                            vehicleDetailQuery.model_id = {[Op.in]: filters.vehicle_models};
                        }
                    } else {
                        // brand and models finding for product categories those valid for all products like mats and accessories
                        const query = {};
                        if (Utils.isNonEmptyArray(filters.vehicle_brands)) {
                            query.brand_id = {[Op.in]: filters.vehicle_brands};
                        }
                        if (Utils.isNonEmptyArray(filters.vehicle_models)) {
                            query.model_id = {[Op.in]: filters.vehicle_models};
                        }
                        if (Utils.isValidNonEmptyObject(query)) {
                            const vehicleDetails = await dao.getRows({
                                tableName: constants.model_values.vehicle_detail.tableName,
                                query,
                                attributes: ['vehicle_type_id'],
                                raw: true
                            });
                            if (Utils.isNonEmptyArray(vehicleDetails)) {
                                // Extract unique vehicle_type_id values greater than 0
                                const vehicleTypeIds = [...new Set(vehicleDetails.filter(item => item.vehicle_type_id > 0).map(item => item.vehicle_type_id))];
                                vehicleDetailQuery.vehicle_type_id = {[Op.in]: vehicleTypeIds};
                            }
                        }
                    }

                    if (!!(filters.vehicle_types?.length)) {
                        vehicleDetailQuery.vehicle_type_id = {[Op.in]: filters.vehicle_types};
                    }
                    if (!!(Object.keys(vehicleDetailQuery).length)) {
                        // const vehicleDetailList = await dao.getRows(
                        //   {
                        //     tableName: constants.model_values.vehicle_detail.tableName,
                        //     query: vehicleDetailQuery,
                        //     attributes: ['id']
                        //   }
                        // );
                        // const idList = vehicleDetailList.map(vehicleDetail => vehicleDetail.id);
                        // if (!!(filters.vehicle_types?.length)) {
                        //   cond[Op.or] = [
                        //     {
                        //       vehicle_details_id: {
                        //         [Op.or]: [{ [Op.in]: idList }, { [Op.eq]: null }]
                        //       }
                        //     },
                        //     { vehicle_type_id: { [Op.in]: filters.vehicle_types } }
                        //   ];
                        // } else {
                        //   cond.vehicle_details_id = {
                        //     [Op.or]: [{ [Op.in]: idList }, { [Op.eq]: null }]
                        //     // [Op.in]: idList
                        //   };
                        // }

                        productVehicleDetailInclude.where = vehicleDetailQuery;
                        productVehicleDetailInclude.required = true;
                        // if (!!(idList?.length)) {
                        //   cond.vehicle_details_id = { [Op.in]: idList };
                        // }

                        // cond[Op.or] = [
                        //   {
                        //     vehicle_details_id: {
                        //       [Op.or]: [{ [Op.in]: idList }, { [Op.eq]: null }]
                        //     }
                        //   },
                        //   { vehicle_type_id: { [Op.in]: filters.vehicle_types } }
                        // ];
                    }

                    // fetching product categories
                    if (!!(filters.product_categories?.length)) {
                        cond.category_id = {[Op.in]: filters.product_categories};
                    }
                }

                /**
                 * Product Combination Filters
                 */

                    // product minor color combinations
                const productVariantMinorColorInclude = {
                        model: db[constants.model_values.product_variant_minor_colors.tableName],
                        attributes: ["id", "product_variant_id", "minor_color_id"]
                    };
                const productVariantMinorColorConditions = {};
                if (!!(filters?.minor_colors?.length)) {
                    productVariantMinorColorConditions.minor_color_id = {[Op.in]: filters.minor_colors};
                }
                if (!!(Object.keys(productVariantMinorColorConditions).length)) {
                    productVariantMinorColorInclude.where = productVariantMinorColorConditions;
                    productVariantMinorColorInclude.required = true;
                }

                // product design, material and major color combinations
                const productVariantInclude = {
                    model: db[constants.model_values.product_variants.tableName],
                    attributes: ['id', 'design_id', 'material_id', 'major_color_id'],
                    include: [
                        {
                            model: db[constants.model_values.design.tableName],
                            // TODO: in future we will remove image
                            attributes: ['id', 'image', 'pictures'],
                        },
                        {
                            model: db[constants.model_values.color.tableName],
                            attributes: ['id', 'name', 'hexadecimal_code'],
                        },
                        {
                            model: db[constants.model_values.product_variant_minor_colors.tableName],
                            attributes: ['id', 'product_variant_id', 'minor_color_id'],
                            include: [
                                {
                                    model: db[constants.model_values.color.tableName],
                                    attributes: ['id', 'name', 'hexadecimal_code'],
                                }
                            ]
                        },
                        productVariantMinorColorInclude
                    ]
                };
                const productVariantConditions = {};
                if (!!(filters?.product_designs?.length)) {
                    productVariantConditions.design_id = {[Op.in]: filters.product_designs};
                }
                if (!!(filters?.product_materials?.length)) {
                    productVariantConditions.material_id = {[Op.in]: filters.product_materials};
                }
                if (!!(filters?.major_colors?.length)) {
                    productVariantConditions.major_color_id = {[Op.in]: filters.major_colors};
                }
                if (!!(Object.keys(productVariantConditions).length)) {
                    productVariantInclude.where = productVariantConditions;
                    productVariantInclude.required = true;
                }

                let order = [];
                if (sort_by && sort_order) {
                    order.push([sort_by, sort_order]);
                }

                return productDao.getUnHideProducts({
                    query: cond,
                    include: [
                        {model: db[constants.model_values.product_category.tableName]},
                        productVariantInclude,
                        productVehicleDetailInclude
                    ],
                    page,
                    limit,
                    order,
                    user_id
                });
            },
            constants.GET_SUCCESS,
            messages.products.get_list
        );
    };

    /**
     * @method getUserRelatedProductList: To get related products
     * @param {Object} req request object
     * @param {Object} res response object
     */
    function getUserRelatedProductList(req, res) {
        return validations.validateSchema(
            req,
            res,
            Validator.getRelatedProductList,
            () => productDao.getUnHideProducts({
                query: {category_id: req.query.product_category_id},
                include: [
                    {model: db[constants.model_values.product_category.tableName]},
                    {model: db[constants.model_values.brand.tableName]},
                    {
                        model: db[constants.model_values.product_variants.tableName],
                        attributes: ['design_id'],
                        include: [
                            {
                                model: db[constants.model_values.design.tableName],
                                // TODO: in future we will remove image
                                attributes: ['image', 'pictures'],
                            },
                        ]
                    }
                ],
                ...req.query
            }),
            constants.GET_SUCCESS,
            messages.products.get_list
        );
    };

    /**
     * @method getProductPrice: To calculate product price based on selected vehicle details
     * @param {Object} req request object
     * @param {Object} res response object
     */
    function getProductPrice(req, res) {
        return validations.validateSchema(
            req,
            res,
            Validator.getProductPrice,
            async () => {
                const query = {};
                if (req.query.design_id) {
                    query.design_id = req.query.design_id;
                }
                if (req.query.vehicle_category_id) {
                    query.vehicle_category_id = req.query.vehicle_category_id;
                }
                if (req.query.brand_id) {
                    const brand = await dao.getRow(constants.model_values.brand.tableName, {id: req.query.brand_id});
                    if (brand?.name?.toUpperCase() === 'ROYAL ENFIELD') {
                        query.brand_id = req.query.brand_id;
                    }
                }

                const productPrice = !!(Object.keys(query)?.length) ? await dao.getRow(constants.model_values.product_price.tableName, query) : null;

                return productPrice ? ((productPrice.base_price || 0) + (productPrice.design_price || 0)) : 0;
            },
            constants.GET_SUCCESS
        );
    };

    /**
     * @method setHideShowProduct: To hide/show any product from website
     * @param {Object} req request object
     * @param {Object} res response object
     */
    function setHideShowProduct(req, res) {
        return validations.validateSchema(
            req,
            res,
            Validator.setHideShowProduct,
            async () => {
                await dao.updateRow(constants.model_values.product.tableName, {id: req.params.id}, {is_hide: sequelize.literal('NOT is_hide')});
                return {};
            },
            constants.GET_SUCCESS
        );
    };

    export {
        createProduct,
        updateProduct,
        getProductGallery,
        deleteProduct,
        getFilters,
        bulkCreateProduct,
        getProduct,
        getProductList,
        getUserProductList,
        getUserProduct,
        getUserRelatedProductList,
        getProductPrice,
        setHideShowProduct
    };
