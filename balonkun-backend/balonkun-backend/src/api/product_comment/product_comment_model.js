"use strict";

/**
 * Adding product comments model
 */
export const product_comment_model = (sequelize, Sequelize) => {
    const model = sequelize.define("product_comments", {
        
        comment:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        author_pic: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        author: {
            type: Sequelize.STRING,
            defaultValue: "Admin",
            allowNull: false,
        },
    });

    return model;
};
