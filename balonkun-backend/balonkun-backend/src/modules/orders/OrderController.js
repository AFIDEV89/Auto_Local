"use strict";
import config from '../../../config.js';
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import db from "../../database/index.js";
import * as DbHandler from "../../db-handlers/index.js";
import { sendMail } from "../../services/index.js";
import * as Html from '../../static/htmls/index.js';
import * as Utils from "../../utils/index.js";
import * as Validator from './OrderValidations.js';
import {email_data, title} from "./confirmation_email.js";
import {UserOrderConfirmation_New} from "../../static/htmls/index.js";
import {updateCourierDetail} from "./OrderValidations.js";

/**
 * @method createOrder: To add new order
 * @param {Object} req request object
 * @param {Object} res response object
 */
const createOrder = async (req, res) => {
    try {
        const { user, body } = req;
        const { store_id,user_address_id } = body;
        const cart = await DbHandler.GetCartProductList({ user_id: user.id });
        if (Utils.isArray(cart)) {
            const subTotal = cart.reduce((total, prod) => {
                const { quantity, product } = prod;
                return total + quantity * Utils.getProductPrice(product);
            }, 0);

            const shippingRate = 12;
            const taxRate = 5;
            const gstRate = 5;

            const tax = (subTotal * taxRate) / 100;
            const gst = (subTotal * gstRate) / 100;
            const shipping = (subTotal * shippingRate) / 100;
            const total = subTotal + shipping + tax + gst;

            const order = await DbHandler.CreateOrder({ store_id, user_address_id,user_id: user.id, total_amount: total });
            if (order?.id) {
                const productList = [];
                cart.forEach((prod) => {
                    const { product_id, quantity, product } = prod;
                    productList.push({
                        order_id: order.id,
                        product_id,
                        quantity,
                        amount_per_product: Utils.getProductPrice(product),
                        total_amount: quantity * Utils.getProductPrice(product),
                    });
                });
                const orderProduct = await DbHandler.CreateOrderProduct(productList);
                if (Utils.isArray(orderProduct)) {
                    const data = await DbHandler.GetOrder({ id: order.id });
                    if (data?.user?.email) {
                        sendMail({
                            to: data.user.email,
                            subject: title,
                            html: Html.UserOrderConfirmation_New(data)
                        });
                    }
                    const store = await DbHandler.GetStore({ id: store_id });
                    const emailData = {
                        subject: "Order confirmation",
                        html: Html.StoreOrderConfirmation(data)
                    };
                    if (store?.email) {
                        sendMail({ ...emailData, to: store.email });
                    }
                    sendMail({ ...emailData, to: config.ADMIN_EMAIL });
                    await DbHandler.RemoveProductFromCart({
                        user_id: user.id,
                    });
                    return res.json({
                        statusCode: constants.CREATION_SUCCESS,
                        message: "Your order has placed successfully.",
                        data
                    });
                } else {
                    await DbHandler.UpdateOrder({
                        data: { status: constants.ORDER_STATUS_LIST.FAILED },
                        cond: { id: order.id }
                    });
                    return res.json({
                        statusCode: constants.FAILURE,
                        message: "Failed to place order.",
                    });
                }
            }
        }
        return res.json({
            statusCode: constants.FAILURE,
            message: "Your cart is empty.",
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error || "Failed to place order.",
        });
    }
};

// function createOrder(req, res) {
//     return validations.validateSchema(
//         req,
//         res,
//         Validator.createOrder,
//         async () => {
//             const { user, body } = req;
//             const { store_id } = body;
//             const cart = await dao.getRows({
//                 tableName: constants.model_values.cart.tableName,
//                 query: { user_id: user.id },
//                 include: [{ model: db[constants.model_values.product.tableName] }]
//             });
//             if (Utils.isArray(cart)) {
//                 const total_amount = cart.reduce((total, prod) => {
//                     const { quantity, product } = prod;
//                     return total + quantity * Utils.getProductPrice(product);
//                 }, 0);
//                 const order = await dao.createRow(constants.model_values.order.tableName, { store_id, user_id: user.id, total_amount });
//                 if (order?.id) {
//                     const productList = [];
//                     cart.forEach((prod) => {
//                         const { product_id, quantity, product } = prod;
//                         productList.push({
//                             order_id: order.id,
//                             product_id,
//                             quantity,
//                             amount_per_product: Utils.getProductPrice(product),
//                             total_amount: quantity * Utils.getProductPrice(product),
//                         });
//                     });
//                     const orderProduct = await dao.createManyRows(constants.model_values.orderProduct.tableName, productList);
//                     if (Utils.isArray(orderProduct)) {
//                         const data = await dao.getRow(
//                             constants.model_values.order.tableName,
//                             { id: order.id },
//                             [
//                                 { model: db[constants.model_values.user.tableName], attributes: { exclude: ['password', 'login_session_token', 'status', 'type'] } },
//                                 {
//                                     model: db[constants.model_values.store.tableName],
//                                     include: [
//                                         { model: db[constants.model_values.address.tableName], },
//                                     ]
//                                 },
//                                 {
//                                     model: db[constants.model_values.orderProduct.tableName],
//                                     include: [
//                                         { model: db[constants.model_values.product.tableName], },
//                                     ]
//                                 },
//                             ]
//                         );
//                         if (data?.user?.email) {
//                             sendMail({
//                                 to: data.user.email,
//                                 subject: "Order confirmation",
//                                 html: Html.UserOrderConfirmation(data)
//                             });
//                         }
//                         const store = await dao.getRow(
//                             constants.model_values.store.tableName,
//                             { id: store_id },
//                             [{ model: db[constants.model_values.address.tableName] }]
//                         );
//                         if (Utils.isObject(store) && store.email) {
//                             sendMail({
//                                 to: store.email,
//                                 subject: "Order confirmation",
//                                 html: Html.StoreOrderConfirmation(data)
//                             });
//                         }
//                         await dao.deleteRow(constants.model_values.cart.tableName, { user_id: user.id });
//                         return data;
//                     } else {
//                         await dao.updateRow(
//                             constants.model_values.order.tableName,
//                             { id: order.id },
//                             { status: constants.ORDER_STATUS_LIST.FAILED },
//                         );
//                         return {
//                             statusCode: constants.FAILURE,
//                             message: "Failed to place order.",
//                         };
//                     }
//                 }
//             }
//             return {
//                 statusCode: constants.FAILURE,
//                 message: "Your cart is empty.",
//             };
//         },
//         constants.CREATION_SUCCESS,
//         messages.orders.create
//     );
// };

/**
 * @method getOrderList: To get order list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getOrderList(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getOrderList,
        () => {
            const { store_id, status, limit, page } = req.query;
            const request = {};
            if (store_id) {
                request.store_id = store_id;
            }
            if (status) {
                request.status = status;
            }
            return dao.getRows({
                tableName: constants.model_values.order.tableName,
                query: request,
                include: [
                    { model: db[constants.model_values.user.tableName], attributes: { exclude: ['password', 'login_session_token', 'status', 'type'] } },
                    { model: db[constants.model_values.store.tableName] },
                    { model: db[constants.model_values.user_address.tableName] },
                ],
                page,
                limit,
            });
        },
        constants.GET_SUCCESS,
        messages.orders.get_list
    );
};
function getOrderForUser(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getOrder,
        async () => {
            let user = req.user;
            return dao.getRows({
                tableName:constants.model_values.order.tableName,
                query:{ user_id: user.id },
                include:[
                    {
                        model: db[constants.model_values.store.tableName],
                        include: [
                            { model: db[constants.model_values.address.tableName] },
                        ]
                    },
                    {
                        model: db[constants.model_values.orderProduct.tableName],
                        include: [
                            { model: db[constants.model_values.product.tableName] },
                        ]
                    },
                    {
                        model: db[constants.model_values.user_address.tableName]
                    },
                ]
            });
        },
        constants.GET_SUCCESS,
        messages.orders.get
    );
};
/**
 * @method getOrder: To get order details
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getOrder(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getProduct,
        async () => {
            return dao.getRow(
                constants.model_values.order.tableName,
                { id: req.params.id },
                [
                    { model: db[constants.model_values.user.tableName], attributes: { exclude: ['password', 'login_session_token', 'status', 'type'] } },
                    {
                        model: db[constants.model_values.store.tableName],
                        include: [
                            { model: db[constants.model_values.address.tableName] },
                        ]
                    },
                    {
                        model: db[constants.model_values.orderProduct.tableName],
                        include: [
                            { model: db[constants.model_values.product.tableName] },
                        ]
                    },
                    {
                        model: db[constants.model_values.user_address.tableName]
                    },
                ]
            );
        },
        constants.GET_SUCCESS,
        messages.orders.get
    );
};

/**
 * @method updateOrderStatus: To change order status
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateOrderStatus(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateOrderStatus,
        async () => {
            await dao.updateRow(constants.model_values.order.tableName, { id: req.params.id }, { status: req.body.status });
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.orders.update_status
    );
};

function udpateCourierDetail(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateCourierDetail,
        async () => {
            await dao.updateRow(constants.model_values.order.tableName, { id: req.params.id },
                { courier_partner: req.body.courier_partner,
                    awb_no: req.body.awb_no,
                    comments: req.body.comments,
            });
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.orders.update_status
    );
};

export { createOrder, getOrderList, updateOrderStatus, getOrder,getOrderForUser,udpateCourierDetail };
