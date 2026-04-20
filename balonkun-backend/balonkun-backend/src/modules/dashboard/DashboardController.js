"use strict";
import sequelize from "sequelize";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import db from "../../database/index.js";
import * as Validator from './DashboardValidations.js';

const { Op } = sequelize;

/**
 * @method GetDashboardProductList: To get dashboard product list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getDashboardProductList(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getDashboardProducts,
        async () => {
            let limit = 10;
            if (req.headers['user-type'] === constants.USER_TYPE.USER) {
                const settings = await dao.getRow(constants.model_values.web_setting.tableName);
                limit = settings.dashboard_products_limit;
            }
            const category = (req.query.category || '').toLowerCase().trim();
            const vehicle_type = (req.query.vehicle_type || '').toLowerCase().trim();
            const categoryCond = {};
            if (category) {
                const categoryList = await dao.getRows({
                    tableName: constants.model_values.product_category.tableName,
                    query: {name: {[Op.like]: '%' + category.replace(/-/g, ' ') + '%'}}
                });
                if (!!categoryList?.length) {
                    categoryCond.category_id = { [Op.in]: categoryList.map(cat => cat.id) };
                }
            }
            const query =  {
                tableName: constants.model_values.product.tableName,
                query: { is_trending: true, ...categoryCond },
                include: [{
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
                {
                    model: db.selectiveShops,
                    as: 'ecommerce',
                    required: false
                }
                ],
                order: [['updatedAt', 'DESC']],
                page: 1,
                limit,
            }
            if (vehicle_type) {
                query.include.push({
                    model: db[constants.model_values.vehicle_detail.tableName],
                    attributes: ['vehicle_type_id'],

                    include: [
                        { model: db[constants.model_values.vehicle_type.tableName], attributes: ['id', 'name'],
                            where: {
                                name: vehicle_type.toUpperCase()
                            }
                        },
                    ]
                });
            }

            const products = await dao.getRows(query);
            return products.list;
        },
        constants.GET_SUCCESS,
        messages.products.get_list
    );
};

export { getDashboardProductList };
