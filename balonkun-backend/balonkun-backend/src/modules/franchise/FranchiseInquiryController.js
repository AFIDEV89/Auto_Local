"use strict";

import storeDb from "../../database/storeDb.js";
import { setResponsedata, setResponseError } from "../../utils/ResponseData.js";
import { sendTemplateMail } from "../../utils/nodemailer.js"; // Optional: to send email notifications

const FranchiseInquiry = storeDb.franchiseInquiries;

export const submitInquiry = async (req, res) => {
    try {
        const { contact_person_name, email, mobile_number, store_name, location, store_area, category } = req.body;

        if (!contact_person_name || !email || !mobile_number) {
            return res.status(400).send(setResponseError(400, "Name, Email, and Mobile number are required."));
        }

        const indianMobileRegex = /^[6-9]\d{9}$/;
        if (!indianMobileRegex.test(mobile_number)) {
            return res.status(400).send(setResponseError(400, "Please provide a valid 10-digit Indian mobile number."));
        }

        const inquiry = await FranchiseInquiry.create({
            contact_person_name,
            email,
            mobile_number,
            store_name,
            location,
            store_area,
            category
        });

        // Optional: Send automated email to the admin
        // try {
        //     await sendTemplateMail({
        //         to: "admin@autoformindia.com",
        //         subject: "New Franchise Inquiry",
        //         text: `New inquiry from ${contact_person_name}. Contact: ${mobile_number}, ${email}. Store: ${store_name}, Location: ${location}`
        //     });
        // } catch (e) {
        //     console.error("Failed to send admin notification email", e);
        // }

        return res.status(200).send(setResponsedata(200, inquiry, "Your inquiry has been submitted successfully."));

    } catch (error) {
        console.error("Error submitting franchise inquiry:", error);
        return res.status(500).send(setResponseError(500, "Internal Server Error", error));
    }
};

export const getInquiries = async (req, res) => {
    try {
        const { status, limit = 20, offset = 0 } = req.query;
        let whereCondition = {};
        if (status) {
            whereCondition.status = status;
        }

        const inquiries = await FranchiseInquiry.findAndCountAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return res.status(200).send(setResponsedata(200, inquiries, "Franchise inquiries fetched successfully."));

    } catch (error) {
        console.error("Error getting franchise inquiries:", error);
        return res.status(500).send(setResponseError(500, "Internal Server Error", error));
    }
};

export const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['New', 'Contacted'].includes(status)) {
            return res.status(400).send(setResponseError(400, "Invalid status. Must be 'New' or 'Contacted'."));
        }

        const inquiry = await FranchiseInquiry.findByPk(id);
        if (!inquiry) {
            return res.status(404).send(setResponseError(404, "Franchise inquiry not found."));
        }

        inquiry.status = status;
        await inquiry.save();

        return res.status(200).send(setResponsedata(200, inquiry, "Inquiry status updated successfully."));

    } catch (error) {
        console.error("Error updating franchise inquiry:", error);
        return res.status(500).send(setResponseError(500, "Internal Server Error", error));
    }
};
