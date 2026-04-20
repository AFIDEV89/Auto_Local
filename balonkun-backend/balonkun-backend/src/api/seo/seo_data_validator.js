import {validations} from "../../common/joi.js";



export const getSEOHeaderValidation = {
    c_id: validations.positive_integer,
    v_id: validations.optional_allow_null_positive_integer,
    v_b_id: validations.optional_allow_null_positive_integer,
    v_m_id: validations.optional_allow_null_positive_integer,
    sc_id: validations.optional_allow_null_positive_integer,
};

export const createSEOHeaderValidation = {
    product_category_id: validations.positive_integer,
    vehicle_category_id: validations.optional_allow_null_positive_integer,
    vehicle_brand_id: validations.optional_allow_null_positive_integer,
    vehicle_model_id: validations.optional_allow_null_positive_integer,
    seo_title: validations.optional_allow_null_string,
    banner_path: validations.optional_allow_null_string,
    category_text: validations.optional_allow_null_string,
    url_text: validations.optional_allow_null_string,
    canonical_url: validations.optional_allow_null_string,
    seo_page_title: validations.optional_allow_null_string,
    seo_page_description: validations.optional_allow_null_string,
};

export const updateSEOHeaderValidation = {
    id: validations.positive_integer,
    product_category_id: validations.optional_positive_integer,
    vehicle_category_id: validations.optional_allow_null_positive_integer,
    vehicle_brand_id: validations.optional_allow_null_positive_integer,
    vehicle_model_id: validations.optional_allow_null_positive_integer,
    seo_title: validations.optional_allow_null_string,
    banner_path: validations.optional_allow_null_string,
    category_text: validations.optional_allow_null_string,
    url_text: validations.optional_allow_null_string,
    canonical_url: validations.optional_allow_null_string,
    seo_page_title: validations.optional_allow_null_string,
    seo_page_description: validations.optional_allow_null_string,
};

export const deleteSEO = {
    id: validations.positive_integer,
};