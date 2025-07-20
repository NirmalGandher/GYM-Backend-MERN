import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";

// 1. Load .env from project root
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2. CORS (allow your front-end)
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    })
);
app.options("*", cors());

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Quick check: are env vars loaded?
console.log("→ SMTP_USER:", process.env.SMTP_USER);
console.log("→ SMTP_PASS:", process.env.SMTP_PASS ? "****" : "MISSING");

// 5. Mail endpoint
app.post("/send/mail", async(req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Provide all details" });
    }

    try {
        await sendEmail({ name, fromEmail: email, message });
        res.json({ success: true, message: "Message Sent Successfully." });
    } catch (err) {
        console.error("❌ Error sending email:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server listening at port ${PORT}`);
});