"use strict";
import db from '../../database/index.js';

/**
 * SubCategory Controller
 */

async function createSubCategory(req, res) {
  try {
    const { name, canonical, image, category_id } = req.body;
    const subCategory = await db.subcategories.create({ name, canonical, image, category_id });
    return res.status(200).json({ statusCode: 200, data: subCategory });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, canonical, image, category_id } = req.body;
    await db.subcategories.update(
      { name, canonical, image, category_id },
      { where: { id } }
    );
    return res.status(200).json({ statusCode: 200, message: "SubCategory updated successfully" });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getSubCategoryList(req, res) {
  try {
    const { page, limit } = req.query;
    const fQuery = {
      order: [['id', 'DESC']]
    };

    if (page && limit) {
      const pg = Number(page) - 1, lt = Number(limit);
      fQuery.offset = pg * lt;
      fQuery.limit = lt;

      const result = await db.subcategories.findAndCountAll(fQuery);
      return res.status(200).json({
        statusCode: 200,
        data: {
          total_count: result.count,
          list: result.rows
        }
      });
    }

    const subcategories = await db.subcategories.findAll(fQuery);
    return res.status(200).json({ statusCode: 200, data: subcategories });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;
    await db.subcategories.destroy({ where: { id } });
    return res.status(200).json({ statusCode: 200, message: "SubCategory deleted successfully" });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getSubCategoryByCategory(req, res) {
  try {
    const { category_id } = req.params;
    const subcategories = await db.subcategories.findAll({
      where: { category_id }
    });
    return res.status(200).json({ statusCode: 200, data: subcategories });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

export { createSubCategory, updateSubCategory, getSubCategoryList, deleteSubCategory, getSubCategoryByCategory };
