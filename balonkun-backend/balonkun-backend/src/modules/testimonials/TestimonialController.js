"use strict";

import storeDb from "../../database/storeDb.js";

const Testimonial = storeDb.testimonials;

// Public + Admin: Fetch all testimonials
export const getTestimonials = async (req, res) => {
    try {
        const { type, status, limit = 50, offset = 0 } = req.query;
        let whereCondition = {};
        
        // Filter by type (carOwners or franchisePartners)
        if (type) {
            whereCondition.type = type;
        }
        
        // Filter by status (Active/Inactive). Public frontend should only fetch 'Active'
        if (status) {
            whereCondition.status = status;
        }

        const data = await Testimonial.findAndCountAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).send({
            statusCode: 200,
            data: data,
            message: "Testimonials fetched successfully."
        });

    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return res.status(500).send({ statusCode: 500, message: "Internal Server Error" });
    }
};

// Admin: Add new testimonial
export const addTestimonial = async (req, res) => {
    try {
        const { clientName, role, description, rating, image, type, status } = req.body;

        if (!clientName || !description) {
            return res.status(400).send({ statusCode: 400, message: "Client name and description are required." });
        }

        const testimonial = await Testimonial.create({
            clientName,
            role,
            description,
            rating: rating || 5,
            image,
            type: type || 'carOwners',
            status: status || 'Active'
        });

        return res.status(200).send({ statusCode: 200, data: testimonial, message: "Testimonial added successfully." });

    } catch (error) {
        console.error("Error adding testimonial:", error);
        return res.status(500).send({ statusCode: 500, message: "Internal Server Error" });
    }
};

// Admin: Update existing testimonial
export const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
            return res.status(404).send({ statusCode: 404, message: "Testimonial not found." });
        }

        await testimonial.update(updateData);

        return res.status(200).send({ statusCode: 200, data: testimonial, message: "Testimonial updated successfully." });

    } catch (error) {
        console.error("Error updating testimonial:", error);
        return res.status(500).send({ statusCode: 500, message: "Internal Server Error" });
    }
};

// Admin: Delete testimonial
export const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
            return res.status(404).send({ statusCode: 404, message: "Testimonial not found." });
        }

        await testimonial.destroy();

        return res.status(200).send({ statusCode: 200, message: "Testimonial deleted successfully." });

    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return res.status(500).send({ statusCode: 500, message: "Internal Server Error" });
    }
};
