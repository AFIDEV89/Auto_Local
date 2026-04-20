"use strict";
import csv from "csv-parser";
import { Readable } from "stream";
import db from "../../database/index.js";

// Map of entity names to their db model keys
const ENTITY_MAP = {
    "categories": "categories",
    "subcategories": "subcategories",
    "materials": "materials",
    "designs": "designs",
    "colors": "colors",
    "products": "products",
    "brands": "brands",
    "brandModels": "brandModels",
    "vehicle_categories": "vehicle_categories",
    "vehicleDetails": "vehicleDetails",
    "seoMappings": "seoMappings",
    "banners": "banners",
};

// JSON fields that need parsing from string
const JSON_FIELDS = {
    products: ["pictures", "videos", "reviews", "tags", "suggestions"],
    designs: ["pictures"],
};

function parseJsonFields(entityName, row) {
    const jsonFields = JSON_FIELDS[entityName] || [];
    for (const field of jsonFields) {
        if (row[field] && typeof row[field] === "string") {
            try {
                row[field] = JSON.parse(row[field]);
            } catch (e) {
                // Leave as string if invalid JSON
            }
        }
    }
    return row;
}

function cleanRow(row) {
    const cleaned = {};
    for (const [key, value] of Object.entries(row)) {
        // Remove BOM from first column key
        const cleanKey = key.replace(/^\uFEFF/, "").trim();
        if (cleanKey === "") continue;
        // Convert empty strings to null
        cleaned[cleanKey] = value === "" ? null : value;
    }
    return cleaned;
}

/**
 * WordPress-style CSV Import:
 * - Row has id → update existing record
 * - Row has no id or empty id → create new record
 */
export async function importCsv(req, res) {
    try {
        const entityName = req.params.entityName;
        const model = db[entityName];

        if (!model) {
            return res.status(400).json({
                statusCode: 400,
                message: `Unknown entity: ${entityName}`,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                statusCode: 400,
                message: "No CSV file uploaded",
            });
        }

        const rows = [];
        const stream = Readable.from(req.file.buffer.toString());

        await new Promise((resolve, reject) => {
            stream
                .pipe(csv())
                .on("data", (row) => {
                    let cleaned = cleanRow(row);
                    cleaned = parseJsonFields(entityName, cleaned);
                    rows.push(cleaned);
                })
                .on("end", resolve)
                .on("error", reject);
        });

        if (rows.length === 0) {
            return res.json({
                statusCode: 200,
                message: "CSV file is empty",
                data: { created: 0, updated: 0, errors: [] },
            });
        }

        let created = 0;
        let updated = 0;
        const errors = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                if (row.id && row.id !== "" && row.id !== "null") {
                    // WordPress-style: ID present → update
                    const existing = await model.findByPk(row.id);
                    if (existing) {
                        const { id, ...updateData } = row;
                        await model.update(updateData, { where: { id: row.id } });
                        updated++;
                    } else {
                        // ID provided but doesn't exist → create with that ID
                        await model.create(row);
                        created++;
                    }
                } else {
                    // No ID → create new
                    const { id, ...createData } = row;
                    await model.create(createData);
                    created++;
                }
            } catch (err) {
                errors.push({
                    row: i + 2, // +2 for header row + 0-index
                    data: row,
                    error: err.message,
                });
            }
        }

        return res.json({
            statusCode: 200,
            message: `Import complete. Created: ${created}, Updated: ${updated}, Errors: ${errors.length}`,
            data: { created, updated, errors },
        });
    } catch (err) {
        console.log("CSV Import Error:", err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message || "CSV import failed",
        });
    }
}

/**
 * Export all rows of an entity as CSV
 */
export async function exportCsv(req, res) {
    try {
        const entityName = req.params.entityName;
        const model = db[entityName];

        if (!model) {
            return res.status(400).json({
                statusCode: 400,
                message: `Unknown entity: ${entityName}`,
            });
        }

        const rows = await model.findAll({
            order: [["id", "ASC"]],
            raw: true,
        });

        if (rows.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                message: "No data to export",
                data: [],
            });
        }

        // Get column headers from first row
        const headers = Object.keys(rows[0]);

        // Build CSV string
        const csvLines = [];
        // BOM + headers
        csvLines.push(headers.join(","));

        for (const row of rows) {
            const values = headers.map((h) => {
                let val = row[h];
                if (val === null || val === undefined) return "";
                // Stringify JSON fields
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                // Escape CSV values
                val = String(val);
                if (val.includes(",") || val.includes('"') || val.includes("\n")) {
                    val = '"' + val.replace(/"/g, '""') + '"';
                }
                return val;
            });
            csvLines.push(values.join(","));
        }

        const csvString = "\uFEFF" + csvLines.join("\n");

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${entityName}_export.csv"`);
        return res.send(csvString);
    } catch (err) {
        console.log("CSV Export Error:", err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message || "CSV export failed",
        });
    }
}
