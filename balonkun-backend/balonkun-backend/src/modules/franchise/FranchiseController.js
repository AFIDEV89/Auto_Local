"use strict";
import * as validations from '../../common/joi.js';
import * as constants from '../../constants/index.js';
import { sendMail } from "../../services/nodemailer/index.js";
import config from "../../../config.js";

/**
 * @method franchiseInquiry: To handle franchise inquiry requests and send emails
 * @param {Object} req request object
 * @param {Object} res response object
 */
async function franchiseInquiry(req, res) {
    const fields = {
        contact_person_name: validations.validations.string,
        email: validations.validations.email,
        mobile_number: validations.validations.string,
        store_name: validations.validations.string.allow("", null),
        location: validations.validations.string.allow("", null),
        store_area: validations.validations.string.allow("", null),
        category: validations.validations.string.allow("", null),
    };

    return validations.validateSchema(
        req,
        res,
        fields,
        async () => {
            const {
                contact_person_name,
                email,
                mobile_number,
                store_name,
                location,
                store_area,
                category
            } = req.body;

            const followUpNote = "The Concerned Area Sales Manager Will Contact For the Further Details";

            // 1. Send Email to User (Thank You)
            const userMailOptions = {
                to: email,
                subject: "Thank You for Your Franchise Inquiry - Autoform India",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2>Dear ${contact_person_name},</h2>
                        <p>Thank you for your interest in becoming a franchise partner with <strong>Autoform India</strong>.</p>
                        <p>We have received your inquiry and our team is currently reviewing your details.</p>
                        <p style="font-weight: bold; color: #ffb200;">${followUpNote}</p>
                        <p>If you have any urgent queries, please feel free to reach out to us at marketing@autoformindia.com.</p>
                        <br>
                        <p>Best Regards,<br>Team Autoform India</p>
                    </div>
                `
            };

            // 2. Send Email to Marketing Team
            const marketingMailOptions = {
                to: config.ADMIN_EMAIL || "marketing@autoformindia.com",
                subject: "New Franchise Inquiry Received",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2>New Franchise Inquiry Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Contact Person</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${contact_person_name}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Mobile Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${mobile_number}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Store Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${store_name || "N/A"}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${location || "N/A"}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Store Area</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${store_area || "N/A"} Sqft</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Category</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${category || "N/A"}</td></tr>
                        </table>
                        <p style="margin-top: 20px; font-weight: bold;">${followUpNote}</p>
                    </div>
                `
            };

            // Trigger emails asynchronously
            sendMail(userMailOptions);
            sendMail(marketingMailOptions);

            return { message: "Inquiry submitted successfully" };
        },
        constants.SUCCESS,
        "Your inquiry has been submitted successfully"
    );
};

export { franchiseInquiry };
