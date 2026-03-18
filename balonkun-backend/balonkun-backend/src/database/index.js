"use strict";
import Sequelize, {DataTypes} from "sequelize";

import * as Models from "../models/index.js";
import config from "../../config.js";



const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DIALECT } = config;

/**
 * To make connection with database
 */
const db = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
    operatorsAliases: "0",
    pool: {
        max: 5,
        min: 0,
        acquire: "30000",
        idle: "10000",
    },
    port: DATABASE_PORT,
});



// Add event listener for process termination
process.on('SIGINT', () => {
    db.close()
        .then(() => {
            console.log('Database connection closed.');
            process.exit(0); // Exit the process gracefully
        })
        .catch((error) => {
            console.error('Error closing database connection:', error);
            process.exit(1); // Exit the process with an error code
        });
});

/**
 * Database models
 */
db.users = Models.UserModel(db, Sequelize);
db.products = Models.ProductModel(db, Sequelize);
db.categories = Models.ProductCategoryModel(db, Sequelize);
db.colors = Models.ColorModel(db, Sequelize);
db.banners = Models.BannerModel(db, Sequelize);
db.blogs = Models.BlogModel(db, Sequelize);
db.vehicleDetails = Models.VehicleDetailsModel(db, Sequelize);
db.materials = Models.MaterialModel(db, Sequelize);
db.review = Models.ReviewModel(db, Sequelize);
db.cartProducts = Models.CartProductModel(db, Sequelize);
db.addresses = Models.AddressModel(db, Sequelize);
db.useraddresses = Models.UserAddressModel(db, Sequelize);
db.stores = Models.StoreModel(db, Sequelize);
db.orders = Models.OrderModel(db, Sequelize);
db.orderProducts = Models.OrderProductModel(db, Sequelize);
// db.productMinorColors = Models.ProductMinorColorModel(db, Sequelize);
// db.productMajorColors = Models.ProductMajorColorModel(db, Sequelize);
// db.productMaterials = Models.ProductMaterialModel(db, Sequelize);
db.vehicleTypes = Models.VehicleTypeModel(db, Sequelize);
db.webSettings = Models.WebSettingModel(db, Sequelize);
db.designs = Models.DesignModel(db, Sequelize);
db.vehicle_categories = Models.VehicleCategoryModel(db, Sequelize);
db.brands = Models.BrandModel(db, Sequelize);
db.brandModels = Models.BrandModelModel(db, Sequelize);
db.productVariants = Models.ProductVariantModel(db, Sequelize);
db.productVariantMinorColors = Models.ProductVariantMinorColorModel(db, Sequelize);
db.blogs = Models.BlogModel(db, Sequelize);
db.blogCategories = Models.BlogCategoryModel(db, Sequelize);
db.blogAuthors = Models.blog_author_model(db, Sequelize);
db.productPrices = Models.ProductPriceModel(db, Sequelize);
db.wishlists = Models.WishlistModel(db, Sequelize);
db.productComments = Models.product_comment_model(db, Sequelize);
db.seoMappings = Models.seo_data_mapping_model(db, Sequelize);
db.leadDatas = Models.LeadDataModel(db, Sequelize);

/**
 * Database model Associations
 */
db.products.belongsTo(db.categories, { foreignKey: "category_id" });
db.cartProducts.belongsTo(db.products, { foreignKey: "product_id" });
db.addresses.belongsTo(db.stores, { foreignKey: "store_id", onDelete: "CASCADE" });
db.stores.hasOne(db.addresses, { foreignKey: "store_id" });
db.useraddresses.belongsTo(db.users, { foreignKey: "user_id" });
db.users.hasMany(db.useraddresses, { foreignKey: "user_id" });
db.orders.belongsTo(db.stores, { foreignKey: "store_id" });
db.orders.belongsTo(db.users, { foreignKey: "user_id" });
db.orders.belongsTo(db.useraddresses, { foreignKey: "user_address_id" });
db.orders.hasMany(db.orderProducts, { foreignKey: "order_id" });
db.orderProducts.belongsTo(db.products, { foreignKey: "product_id" });
// db.products.hasMany(db.productMinorColors, { foreignKey: "product_id" });
// db.products.hasMany(db.productMajorColors, { foreignKey: "product_id" });
// db.products.hasMany(db.productMaterials, { foreignKey: "product_id" });
// db.productMinorColors.belongsTo(db.colors, { foreignKey: "color_id" });
// db.productMajorColors.belongsTo(db.colors, { foreignKey: "color_id" });
// db.productMaterials.belongsTo(db.materials, { foreignKey: "material_id" });
db.vehicleDetails.belongsTo(db.vehicle_categories, { foreignKey: "vehicle_category_id" });
db.vehicleDetails.belongsTo(db.vehicleTypes, { foreignKey: "vehicle_type_id" });
db.vehicleDetails.belongsTo(db.brandModels, { foreignKey: "model_id" });
db.vehicle_categories.hasMany(db.vehicleDetails, { foreignKey: "vehicle_category_id" });
db.brandModels.belongsTo(db.brands, { foreignKey: "brand_id" });
db.brandModels.belongsTo(db.vehicleTypes, { foreignKey: "vehicle_type_id" });
db.vehicleTypes.hasMany(db.brandModels, { foreignKey: "vehicle_type_id" });
db.brands.belongsTo(db.vehicleTypes, { foreignKey: "vehicle_type_id" });
db.vehicleTypes.hasMany(db.brands, { foreignKey: "vehicle_type_id" });
db.brands.hasMany(db.brandModels, { foreignKey: "brand_id" });
db.vehicleDetails.belongsTo(db.brands, { foreignKey: "brand_id" });
db.productVariants.belongsTo(db.products, { foreignKey: "product_id" });
db.products.hasMany(db.productVariants, { foreignKey: "product_id" });
db.productVariants.belongsTo(db.designs, { foreignKey: "design_id" });
db.productVariants.belongsTo(db.materials, { foreignKey: "material_id" });
db.productVariants.belongsTo(db.colors, { foreignKey: "major_color_id" });
db.productVariantMinorColors.belongsTo(db.productVariants, { foreignKey: "product_variant_id" });
db.productVariants.hasMany(db.productVariantMinorColors, { foreignKey: "product_variant_id" });
db.productVariantMinorColors.belongsTo(db.colors, { foreignKey: "minor_color_id" });
db.colors.hasMany(db.productVariantMinorColors, { foreignKey: "minor_color_id" });
db.productVariants.belongsTo(db.colors, { foreignKey: "major_color_id" });
db.materials.hasMany(db.productVariants, { foreignKey: "material_id" });
db.productVariants.belongsTo(db.materials, { foreignKey: "material_id" });
db.designs.hasMany(db.productVariants, { foreignKey: "design_id" });
db.productVariants.belongsTo(db.designs, { foreignKey: "design_id" });
db.products.belongsTo(db.brands, { foreignKey: "brand_id" });
db.brands.hasMany(db.products, { foreignKey: "brand_id" });
db.blogCategories.hasMany(db.blogs, { foreignKey: "blog_category_id" });
db.blogs.belongsTo(db.blogCategories, { foreignKey: "blog_category_id" });
db.blogs.belongsTo(db.blogAuthors, { foreignKey: "blog_author_id" });
db.blogAuthors.hasMany(db.blogs, { foreignKey: "blog_author_id" });
db.vehicleDetails.hasMany(db.products, { foreignKey: "vehicle_details_id" });
db.products.belongsTo(db.vehicleDetails, { foreignKey: "vehicle_details_id" });
db.products.hasMany(db.wishlists, { foreignKey: "product_id" });
db.products.hasMany(db.productComments, { foreignKey: "product_id" });
db.wishlists.belongsTo(db.products, { foreignKey: "product_id" });
db.wishlists.belongsTo(db.users, { foreignKey: "user_id" });


db.categories.hasMany(db.seoMappings, { foreignKey: "product_category_id" });
 db.seoMappings.belongsTo(db.categories,{foreignKey:"product_category_id"})
db.vehicleTypes.hasMany(db.seoMappings, { foreignKey: "vehicle_category_id" });
 db.seoMappings.belongsTo(db.vehicleTypes,{foreignKey:"vehicle_category_id"})
db.brands.hasMany(db.seoMappings, { foreignKey: "vehicle_brand_id" });
 db.seoMappings.belongsTo(db.brands,{foreignKey:"vehicle_brand_id"})
db.brandModels.hasMany(db.seoMappings, { foreignKey: "vehicle_model_id" });
 db.seoMappings.belongsTo(db.brandModels,{foreignKey:"vehicle_model_id"})
db.leadDatas.belongsTo(db.products,{ foreignKey: "product_id" })
db.products.hasMany(db.leadDatas,{ foreignKey: "product_id" })

export default db;
