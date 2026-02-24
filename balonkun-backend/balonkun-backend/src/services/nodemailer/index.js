import nodemailer from "nodemailer";

import config from "../../../config.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    // port: 465,
    secure: false, // TLS
    auth: {
        user: config.SMTP_EMAIL,
        pass: config.SMTP_PASSWORD,
    },
});

export const sendMail = (request) => {
    const options = {
        from: config.SMTP_SENDER_EMAIL,
        text: "",
        ...request,
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log("Email sent error: ", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};
