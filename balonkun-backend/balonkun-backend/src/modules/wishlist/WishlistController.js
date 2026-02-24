"use strict";
import * as validations from '../../common/joi.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import * as Validator from './WishlistValidations.js';
import db from "../../database/index.js";
import messages from "../../common/messages/content.js";

/**
 * @method updateWishlist: To hide/show any product from website
 * @param {Object} req request object
 * @param {Object} res response object
 */
export function updateWishlist(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.updateWishlist,
    async () => {
      const request = { user_id: req.user.id, product_id: req.params.id };
      const tableName = constants.model_values.wishlist.tableName;
      const data = await dao.getRow(tableName, request);
      if (data?.id) {
        await dao.deleteRow(tableName, request);
        return { message: 'Removed From Wishlist' };
      } else {
        await dao.createRow(tableName, request);
        return { message: 'Added To Wishlist' };
      }
    },
    constants.UPDATE_SUCCESS
  );
};

export function getWishList(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            const request = { user_id: req.user.id};
            const tableName = constants.model_values.wishlist.tableName;
            return await dao.getRows({
                tableName,
                request,
                include: [{ model: db.products}]
            },
                constants.GET_SUCCESS,
                "");
        },
        constants.UPDATE_SUCCESS
    );
};

