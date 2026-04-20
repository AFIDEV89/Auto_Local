"use strict";

/**
 * Adding blog model
 */
export const seo_data_mapping_model = (sequelize, Sequelize) => {
    const model = sequelize.define("seo_data_mapping", {

        product_category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        vehicle_category_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        product_subcategory_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        vehicle_brand_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        vehicle_model_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        seo_title: {
            type: Sequelize.STRING,
        },
        banner_path: {
            type: Sequelize.STRING,
        },
        category_text: {
            type: Sequelize.STRING,
        },
        url_text: {
            type: Sequelize.STRING,
            unique:true
        },
        url: {
            type: Sequelize.STRING,
            unique:true
        },
        seo_page_title: {
            type: Sequelize.STRING,
            unique:true
        },
        seo_page_description: {
            type: Sequelize.STRING,
            unique:true
        },
        canonical_url: {
            type: Sequelize.STRING,
            unique:true
        },
    });

    return model;
};


