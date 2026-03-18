import * as dao from "../../database/dao/index.js";
import * as constants from "../../constants/index.js";
import messages from "../../common/messages/content.js";
import * as validations from '../../common/joi.js';
import {model_values} from "../../constants/index.js";
import {
    createSEOHeaderValidation,
    deleteSEO,
    getSEOHeaderValidation,
    updateSEOHeaderValidation
} from "./seo_data_validator.js";
import db from "../../database/index.js";
import {Op} from "sequelize";

export function get_seo_header(req, res) {
    let query = {}
    query['product_category_id'] = req.query.c_id;
    if (req.query.v_id)
        query['vehicle_category_id'] = req.query.v_id;
    if (req.query.v_b_id)
        query['vehicle_brand_id'] = req.query.v_b_id;
    if (req.query.v_m_id)
        query['vehicle_model_id'] = req.query.v_m_id;
    query['url'] = null;

    return validations.validateSchema(
        req,
        res,
        getSEOHeaderValidation,
        async () => {
            return dao.getRow(model_values.seo_data_mapping.tableName, query, null, {raw: true}).then(data => {
                if (data) {
                    return data
                } else {
                    return {}
                }

            })
        },
        constants.GET_SUCCESS,
        messages.blogs_author.get
    );
}

export function get_seo_footer(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            let data = await dao.getRows({
                tableName: model_values.seo_data_mapping.tableName,
                include: [{
                    model: db[constants.model_values.product_category.tableName],
                    attributes: ['name'],
                },
                    {
                        model: db[constants.model_values.vehicle_type.tableName],
                        attributes: ['name'],
                    }, {
                        model: db[constants.model_values.brand.tableName],
                        attributes: ['name'],
                    }, {
                        model: db[constants.model_values.brand_model.tableName],
                        attributes: ['name'],
                    },
                ],
                raw: true
            })
            let result = {}
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.seo_title) {
                    if (!result[d.seo_title]) {
                        result[d.seo_title] = [];

                    }
                    result[d.seo_title].push(d)
                }
            }
            return result
        },
        constants.CREATION_SUCCESS,
        messages.blogs_author.create
    );
};

export function update_seo_options(req, res) {

    return validations.validateSchema(
        req,
        res,
        updateSEOHeaderValidation,
        () => dao.updateRow(model_values.seo_data_mapping.tableName, {id: req.params.id}, req.body),
        constants.CREATION_SUCCESS,
        messages.blogs_author.create
    );
}

export function get_seo_list_footer(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;
    let query = {"seo_title": {[Op.ne]: null}}
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: model_values.seo_data_mapping.tableName,
            query,
            include: [{
                model: db[constants.model_values.product_category.tableName],
                attributes: ['name'],
            },
                {
                    model: db[constants.model_values.vehicle_type.tableName],
                    attributes: ['name'],
                }, {
                    model: db[constants.model_values.brand.tableName],
                    attributes: ['name'],
                }, {
                    model: db[constants.model_values.brand_model.tableName],
                    attributes: ['name'],
                },
            ],
            page,
            limit,
        }),
        constants.GET_SUCCESS,
        messages.blogs_author.get_list
    );
}

export function get_seo_list(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;
    let query = {"seo_title": {[Op.eq]: null}}
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: model_values.seo_data_mapping.tableName,
            query,
            include: [{
                model: db[constants.model_values.product_category.tableName],
                attributes: ['name'],
            },
                {
                    model: db[constants.model_values.vehicle_type.tableName],
                    attributes: ['name'],
                }, {
                    model: db[constants.model_values.brand.tableName],
                    attributes: ['name'],
                }, {
                    model: db[constants.model_values.brand_model.tableName],
                    attributes: ['name'],
                },
            ],
            page,
            limit,
        }),
        constants.GET_SUCCESS,
        messages.blogs_author.get_list
    );
}
export function get_seo_links(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;
    return validations.validateSchema(
        req,
        res,

        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: model_values.seo_data_mapping.tableName,
            query: null,
            include: [{
                model: db[constants.model_values.product_category.tableName],
                attributes: ['name'],
            },
                {
                    model: db[constants.model_values.vehicle_type.tableName],
                    attributes: ['name'],
                }, {
                    model: db[constants.model_values.brand.tableName],
                    attributes: ['name'],
                }, {
                    model: db[constants.model_values.brand_model.tableName],
                    attributes: ['name'],
                },
            ],
            page,
            limit,
        }),
        constants.GET_SUCCESS,
        messages.blogs_author.get_list
    );
}

export async function create_seo_options(req, res) {
    let {product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id} = req.body
    let query = {}


    if (product_category_id) {
        query['product_category_id'] = product_category_id
    } else {
        query['product_category_id'] = null
    }


    if (vehicle_category_id) {
        query['vehicle_category_id'] = vehicle_category_id
    } else {
        query['vehicle_category_id'] = null
    }


    if (vehicle_brand_id) {
        query['vehicle_brand_id'] = vehicle_brand_id
    } else {
        query['vehicle_brand_id'] = null
    }


    if (vehicle_model_id) {
        query['vehicle_model_id'] = vehicle_model_id
    } else {
        query['vehicle_model_id'] = null
    }


    query["url"] = null
    let data = await dao.getRow(model_values.seo_data_mapping.tableName, query)
    if (data) {
        return res.json({
            statusCode: constants.FAILURE,
            message: "Seo Already Exist"
        })
    }


// console.log(req.body)
    return validations.validateSchema(
        req,
        res,
        createSEOHeaderValidation,
        () => dao.createRow(model_values.seo_data_mapping.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.blogs_author.create
    );
}
export async function delete_seo_options(req, res) {
    return validations.validateSchema(
        req,
        res,
        deleteSEO,
        () => dao.deleteRow('seoMappings', { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.blogs.delete
    );
}
export function get_seo_filter(req, res) {
    // console.log(req.params)
    let url_text = req.params.url_text;
    let query = {}
    query['canonical_url'] = url_text;
    return validations.validateSchema(
        req,
        res,
        null,
        () =>
            dao.getRow(model_values.seo_data_mapping.tableName,
                query,
                [{
                    model: db[constants.model_values.product_category.tableName],
                    attributes: ['name'],
                },
                    {
                        model: db[constants.model_values.vehicle_type.tableName],
                        attributes: ['name'],
                    }, {
                    model: db[constants.model_values.brand.tableName],
                    attributes: ['name'],
                }, {
                    model: db[constants.model_values.brand_model.tableName],
                    attributes: ['name'],
                },
                ],
                {raw: true}),
        constants.CREATION_SUCCESS,
        messages.blogs_author.create
    );
};