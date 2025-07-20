import nodemailer from "nodemailer";

/**
 * Send an email using the provided details.
 * @param {Object} param0 - Object containing name, fromEmail, and message.
 */
export async function sendEmail({ name, fromEmail, message }) {
    // Check required fields
    if (!name || !fromEmail || !message) {
        throw new Error("Missing name, fromEmail, or message in sendEmail function.");
    }

    // Ensure environment variables are set
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        console.warn("⚠️ SMTP environment variables are missing.");
        throw new Error("SMTP configuration is incomplete.");
    }

    // 1. Create transporter
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465, // Secure for port 465
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    // 2. Mail options
    const mailOptions = {
        from: `"${name}" <${fromEmail}>`,
        to: SMTP_USER, // Inbox
        subject: "GYM WEBSITE CONTACT",
        text: message,
        replyTo: fromEmail,
    };

    // 3. Send
    return transporter.sendMail(mailOptions);
}