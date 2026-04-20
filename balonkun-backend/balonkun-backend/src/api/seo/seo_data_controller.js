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

export async function get_seo_header(req, res) {
    // Normalize parameters: treat 'null', 'undefined', '0', 0, or missing as null
    const normalizeId = (val) => {
        if (!val || val === 'null' || val === 'undefined' || val === '0' || parseInt(val) <= 0) return null;
        return val;
    };

    const c_id = normalizeId(req.query.c_id);
    const v_id = normalizeId(req.query.v_id);
    const v_b_id = normalizeId(req.query.v_b_id);
    const v_m_id = normalizeId(req.query.v_m_id);
    const sc_id = normalizeId(req.query.sc_id);

    return validations.validateSchema(
        req,
        res,
        getSEOHeaderValidation,
        async () => {
            const attempts = [];

            // 1. Exact Match (with Subcategory)
            if (c_id) {
                attempts.push({
                    product_category_id: c_id,
                    vehicle_category_id: v_id,
                    vehicle_brand_id: v_b_id,
                    vehicle_model_id: v_m_id,
                    product_subcategory_id: sc_id,
                    url: null
                });
            }

            // 2. Exact Match (without Subcategory)
            if (sc_id) {
                attempts.push({
                    product_category_id: c_id,
                    vehicle_category_id: v_id || null,
                    vehicle_brand_id: v_b_id || null,
                    vehicle_model_id: v_m_id || null,
                    product_subcategory_id: null,
                    url: null
                });
            }

            // 3. Brand Level Match (fallback if model was provided but no model-specific row exists)
            if (v_m_id && v_b_id) {
                attempts.push({
                    product_category_id: c_id,
                    vehicle_category_id: v_id || null,
                    vehicle_brand_id: v_b_id,
                    vehicle_model_id: null,
                    product_subcategory_id: null,
                    url: null
                });
            }

            // 4. Default Brand Match (if only brand was provided)
            if (v_b_id && !v_m_id) {
                attempts.push({
                    product_category_id: c_id,
                    vehicle_category_id: v_id || null,
                    vehicle_brand_id: v_b_id,
                    vehicle_model_id: null,
                    product_subcategory_id: null,
                    url: null
                });
            }

            // 5. Category Level Match
            attempts.push({
                product_category_id: c_id,
                vehicle_category_id: v_id || null,
                vehicle_brand_id: null,
                vehicle_model_id: null,
                product_subcategory_id: null,
                url: null
            });

            console.log(`[SEO DEBUG] Input params: c_id=${c_id}, v_b_id=${v_b_id}, v_m_id=${v_m_id}`);
            for (let i = 0; i < attempts.length; i++) {
                const query = attempts[i];
                console.log(`[SEO DEBUG] Attempt ${i + 1} query:`, JSON.stringify(query));
                const data = await dao.getRow(model_values.seo_data_mapping.tableName, query, null, { raw: true });
                if (data && Object.keys(data).length > 0) {
                    console.log(`[SEO DEBUG] Attempt ${i + 1} SUCCESS: ID=${data.id}, Title=${data.seo_page_title}`);
                    return data;
                }
            }
            console.log(`[SEO DEBUG] No match found in DB, falling back to dynamic generation.`);

            // Fallback: Generate a clean dynamic title if absolutely no record exists
            return await generateDefaultSEO(req.query);
        },
        constants.GET_SUCCESS,
        messages.blogs_author.get
    );
}

async function generateDefaultSEO(queryParams) {
    const { c_id, v_b_id, v_m_id } = queryParams;
    let titleParts = [];

    try {
        if (v_b_id) {
            const brand = await dao.getRow(model_values.brand.tableName, { id: v_b_id }, null, { attributes: ['name'], raw: true });
            if (brand) titleParts.push(brand.name);
        }
        if (v_m_id) {
            const model = await dao.getRow(model_values.brand_model.tableName, { id: v_m_id }, null, { attributes: ['name'], raw: true });
            if (model) titleParts.push(model.name);
        }
        if (c_id) {
            const category = await dao.getRow(model_values.product_category.tableName, { id: c_id }, null, { attributes: ['name'], raw: true });
            if (category) titleParts.push(category.name);
        }
    } catch (e) {
        console.error("Error generating default SEO:", e);
    }

    const title = titleParts.length > 0 ? titleParts.join(' ') : 'Autoform Products';
    return {
        seo_page_title: title,
        seo_title: null,
        category_text: `<h1>${title}</h1><p>Explore our premium range of ${title.toLowerCase()} crafted for perfection.</p>`
    };
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