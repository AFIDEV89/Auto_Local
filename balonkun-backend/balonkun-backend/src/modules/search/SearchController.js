"use strict";
import sequelize from "sequelize";
import * as constants from "../../constants/index.js";
import db from "../../database/index.js";

import * as dao from "../../database/dao/index.js";

const { Op } = sequelize;

export const search = async (req, res) =>{
     let query = req.query.q;
     console.log(query)
    return             res.json({
        statusCode: constants.GET_SUCCESS,
        data: await getProductList(query),
    });

    //return getProductList(query)

};

async function getProductList(query) {
    const productVehicleDetailInclude = {model: db[constants.model_values.vehicle_detail.tableName]};
    const cond = {};

    console.log(cond)
    cond.name = {[Op.like]: `%${query}%`};
    const page = 0;
    const limit = 5
    try {
        // Process the limitedProducts array here
        return await dao.getRows({
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
                            // TODO: in the future, we will remove image
                            attributes: ['image', 'pictures'],
                        },
                    ],
                },
            ],
            page:1,
            limit: 5, // Set the limit to 5 to retrieve only 5 rows
        });
    } catch (error) {
        // Handle any errors here
        console.error('Error:', error);
        throw error; // You can rethrow the error or handle it as needed

    }
}
// export { search};
