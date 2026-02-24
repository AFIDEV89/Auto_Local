"use strict";
import sequelize from "sequelize";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const ProductModel = db.products;
const CategoryModel = db.categories;
const ReviewModel = db.review;
const ColorModel = db.colors;
const MaterialModel = db.materials;
const DesignModel = db.designs;
const BrandModel = db.brands;
// const ProductMajorColorModel = db.productMajorColors;
// const ProductMinorColorModel = db.productMinorColors;
// const MaterialModel = db.materials;
// const ProductMaterialModel = db.productMaterials;
const ProductVariantsModel = db.productVariants;
const ProductVariantMinorColorsModel = db.productVariantMinorColors;

const { Op } = sequelize;

/**
 * @method CreateProduct: To add new product
 * @param {Object} data product detail
 */
export const CreateProduct = (data) => {
    try {
        return new Promise(async (resolve) => {
            // const response = await ProductModel.findOne({
            //     where: { name: data.name.trim() }
            // });
            // if (response?.name) {
            //     resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.PRODUCT }));
            //     return;
            // }
            ProductModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetGalleryImages: To fetch product gallery
 */
export const GetGalleryImages = async (id) => {
    try {
        const productResult = await ProductModel.findAll({ where: { id }, attributes: ['pictures'] });
        const reviewResult = await ReviewModel.findAll({ where: { id }, attributes: ['image'] });

        let result = [];
        if (productResult && productResult.length > 0) {
            result = productResult;
        }
        if (reviewResult && reviewResult.length > 0) {
            result = result.concat(reviewResult);
        }

        return result;

    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetProductList: To fetch products
 */
export const GetProductList = (cond = {}, isRequiredAllChildren = false) => {
    try {
        return new Promise((resolve) => {
            ProductModel.findAll({
                where: cond,
                include: isRequiredAllChildren
                    ? [
                        { model: CategoryModel },
                        { model: BrandModel },
                        // { model: ProductMinorColorModel, include: [{ model: ColorModel }] },
                        // { model: ProductMajorColorModel, include: [{ model: ColorModel }] },
                        // { model: ProductMaterialModel, include: [{ model: MaterialModel }] },
                    ]
                    : [{ model: CategoryModel }, { model: BrandModel }]
            })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method UpdateProduct: To update existing product
 * @param {Object} detail product detail
 */
export const UpdateProduct = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            if (data.name) {
                const response = await ProductModel.findOne({
                    where: { [Op.and]: [{ name: data.name.trim() }, { id: { [Op.ne]: cond.id } }] }
                });
                if (response?.name) {
                    resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.PRODUCT }));
                    return;
                }
            }
            ProductModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method DeleteProduct: To delete existing product
 * @param {Object} cond product detail
 */
export const DeleteProduct = (cond) => {
    try {
        return new Promise((resolve) => {
            ProductModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetProduct: To fetch product details
 */
export const GetProduct = (cond) => {
    try {
        return new Promise((resolve) => {
            ProductModel.findOne({
                where: cond,
                include: [
                    { model: CategoryModel },
                    {
                        model: ProductVariantsModel,
                        include: [
                            {
                                model: ColorModel,
                            },
                            {
                                model: MaterialModel,
                            },
                            {
                                model: DesignModel,
                            },
                            {
                                model: ProductVariantMinorColorsModel,
                                include: [{ model: ColorModel }]
                            }
                        ]
                    },
                    // { model: ProductMinorColorModel, include: [{ model: ColorModel }] },
                    // { model: ProductMajorColorModel, include: [{ model: ColorModel }] },
                    // { model: ProductMaterialModel, include: [{ model: MaterialModel }] },
                    { model: BrandModel },
                ]
            })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
