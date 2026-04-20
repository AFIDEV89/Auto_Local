"use strict";

import * as dao from "../../database/dao/index.js";
import * as validations from "../../common/joi.js";
import messages from "../../common/messages/content.js";
import * as constants from "../../constants/index.js";
import db from "../../database/index.js";

/**
 * @method addToShop: Registers a product for online sale
 */
export async function addToShop(req, res) {
    try {
        const { product_id } = req.body;
        if (!product_id) {
            return res.status(400).json({ statusCode: 400, message: "Product ID is required" });
        }

        // Check if already exists
        const existing = await db.selectiveShops.findOne({ where: { product_id } });
        if (existing) {
            return res.status(200).json({ statusCode: 200, message: "Product is already in the shop registry" });
        }

        const result = await db.selectiveShops.create({ product_id });
        return res.status(200).json({
            statusCode: 200,
            message: "Product added to shop successfully",
            data: result
        });
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}

/**
 * @method bulkAddToShop: Registers multiple products for online sale
 */
export async function bulkAddToShop(req, res) {
    try {
        const { product_ids } = req.body;
        if (!product_ids || !Array.isArray(product_ids)) {
            return res.status(400).json({ statusCode: 400, message: "Valid Product IDs array is required" });
        }

        const entries = product_ids.map(id => ({ product_id: id }));
        
        // Use bulkCreate with ignoreDuplicates (or updateOnDuplicate if needed)
        const result = await db.selectiveShops.bulkCreate(entries, { 
            ignoreDuplicates: true 
        });

        return res.status(200).json({
            statusCode: 200,
            message: "Products registered for online sale successfully",
            data: result
        });
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}

/**
 * @method removeFromShop: Removes a product from online sale registry
 */
export async function removeFromShop(req, res) {
    try {
        const { product_id } = req.params;
        await db.selectiveShops.destroy({ where: { product_id } });
        return res.status(200).json({
            statusCode: 200,
            message: "Product removed from shop registry successfully"
        });
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}

/**
 * @method getShopRegistry: Lists all saleable products with pagination and search
 */
export async function getShopRegistry(req, res) {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const productWhere = {};
        if (search) {
            productWhere.name = { [db.Sequelize.Op.like]: `%${search}%` };
        }

        const { count, rows } = await db.selectiveShops.findAndCountAll({
            include: [{
                model: db.products,
                where: productWhere,
                attributes: ['id', 'name', 'product_code'],
                required: true // This ensures we only get products that exist and match the search
            }],
            limit: parseInt(limit),
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            statusCode: 200,
            message: "Shop registry fetched successfully",
            data: {
                list: rows,
                total_count: count
            }
        });
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
