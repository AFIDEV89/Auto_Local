"use strict";

/**
 * Adding blog model
 */
export const blog_author_model = (sequelize, Sequelize) => {
    const model = sequelize.define("blog_authors", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        image_path: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            defaultValue: "Admin",
            allowNull: false,
        },
    });

    return model;
};
