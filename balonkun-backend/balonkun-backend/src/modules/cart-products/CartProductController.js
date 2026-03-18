"use strict";
import Sequelize from "sequelize";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import db from "../../database/index.js";
import * as DbHandler from "../../db-handlers/index.js";

const { CART_PRODUCT_OPERATION_TYPE } = constants;

/**
 * @method AddProductToCart: To add product to user cart
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const AddProductToCart = async (req, res) => {
    try {
        const { body, user } = req;
        const { product_id } = body;
        const cart = await DbHandler.AddProductToCart({
            user_id: user.id,
            product_id,
            quantity: 1,
        });
        let isAdded = false;
        if (cart?.isDuplicate) {
            const cart = await DbHandler.UpdateCartProduct({
                data: {
                    quantity: Sequelize.literal("quantity + 1"),
                },
                cond: { user_id: user.id, product_id },
            });
            if (cart === true) {
                isAdded = true;
            }
        } else if (cart?.id) {
            isAdded = true;
        }
        if (isAdded) {
            res.json({
                statusCode: constants.CREATION_SUCCESS,
                message: "Added to cart.",
            });
        } else {
            res.json({
                statusCode: constants.FAILURE,
                message: "Failed to add a product to cart",
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
 * @method UpdateCartProduct: To update cart product quantity
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const UpdateCartProduct = async (req, res) => {
    try {
        const { body, user, params } = req;
        const { id } = params;
        const { operationType } = body;
        const cart = await DbHandler.UpdateCartProduct({
            data: {
                quantity: Sequelize.literal(operationType === CART_PRODUCT_OPERATION_TYPE.INCREMENT ? "quantity + 1" : "quantity - 1"),
            },
            cond: { user_id: user.id, product_id: id },
        });
        if (cart === true) {
            res.json({
                statusCode: constants.UPDATE_SUCCESS,
                message: "Product quantity has been updated successfully.",
                data: {},
            });
        } else {
            res.json({
                statusCode: constants.FAILURE,
                message: cart,
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
 * @method RemoveProductFromCart: To remove product from the cart
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const RemoveProductFromCart = async (req, res) => {
    try {
        const { user, params } = req;
        const { id } = params;
        const cart = await DbHandler.RemoveProductFromCart({
            user_id: user.id,
            product_id: id,
        });
        if (cart === true) {
            res.json({
                statusCode: constants.DELETE_SUCCESS,
                message: "Product has been removed from the cart successfully.",
                data: {},
            });
        } else {
            res.json({
                statusCode: constants.FAILURE,
                message: cart,
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
 * @method getCartProductList: To get cart products list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getCartProductList(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return dao.getRows({
                tableName: constants.model_values.cart.tableName,
                query: { user_id: req.user.id },
                include: [
                    {
                        model: db[constants.model_values.product.tableName],
                        include: [{
                            model: db[constants.model_values.product_variants.tableName],
                            attributes: ['id', 'design_id'],
                            include: [
                                {
                                    model: db[constants.model_values.design.tableName],
                                    attributes: ['id', 'pictures'],
                                },
                            ]
                        }]
                    }
                ],
                order: [['createdAt', 'ASC']]
            });
        },
        constants.GET_SUCCESS,
        messages.cart_products.get_list
    );
};

/**
 * @method GetTotalNoOfCartProducts: To get total no. of cart products
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const GetTotalNoOfCartProducts = async (req, res) => {
    try {
        const count = await DbHandler.GetTotalNoOfCartProducts({ user_id: req.user.id });
        if (count > 0) {
            res.json({
                statusCode: constants.GET_SUCCESS,
                message: "Get total no. of cart products successfully.",
                data: count,
            });
        } else {
            res.json({
                statusCode: constants.GET_SUCCESS,
                message: "Cart is empty.",
                data: 0,
            });
        }
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

export { getCartProductList };
