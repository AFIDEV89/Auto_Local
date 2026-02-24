"use strict";
import { ORDER_PAYMENT_TYPE_LIST, ORDER_STATUS_LIST, ORDER_PAYMENT_STATUS_LIST } from '../../constants/index.js';

/**
 * Adding order model
 */
export const OrderModel = (sequelize, Sequelize) => {
    const model = sequelize.define("order", {
        user_id: {
            type: Sequelize.INTEGER,
        },
        store_id: {
            type: Sequelize.INTEGER,
        },
        user_address_id: {
            type: Sequelize.INTEGER,
        },
        total_amount: {
            type: Sequelize.INTEGER,
        },
        courier_partner: {
            type: Sequelize.STRING,
        },
        awb_no: {
            type: Sequelize.STRING,
        },
        comments: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM(...Object.values(ORDER_STATUS_LIST)),
            defaultValue: ORDER_STATUS_LIST.NEW_ORDER
        },
        payment_type: {
            type: Sequelize.ENUM(...Object.values(ORDER_PAYMENT_TYPE_LIST)),
            defaultValue: ORDER_PAYMENT_TYPE_LIST.CASH
        },
        payment_status: {
            type: Sequelize.ENUM(...Object.values(ORDER_PAYMENT_STATUS_LIST)),
            defaultValue: ORDER_STATUS_LIST.PENDING
        },
    });

    return model;
};
