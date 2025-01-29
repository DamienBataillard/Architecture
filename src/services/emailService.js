const nodemailer = require("nodemailer");
require("dotenv").config();

// Check if credentials exist before creating the transporter
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("❌ SMTP credentials missing! Check your .env file.");
}

// SMTP Transport Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 465,
    secure: true, // `true` for 465, `false` for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Function to Send Emails
const sendEmail = async (to, subject, html) => {
    try {
        if (!to || !subject || !html) {
            throw new Error("❌ Missing email parameters!");
        }

        const info = await transporter.sendMail({
            from: `"MyApp" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`✅ Email sent to ${to} | Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw new Error("Failed to send email. Check SMTP credentials.");
    }
};

module.exports = sendEmail;
