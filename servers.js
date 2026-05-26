const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Protect email account passwords via env config

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend mapping configuration interaction

// 1. Setup email transmission protocol (SMTP Configuration)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your custom business domain mail client hosting protocol
    auth: {
        user: process.env.EMAIL_USER,       // Your company outbox address (e.g., system@maridadimotors.com)
        pass: process.env.EMAIL_PASSWORD   // Protected App Password credential token
    }
});

// 2. Handle the incoming Inquiry Funnel
app.post('/api/inquiry', async (req, res) => {
    const { car, name, phone, email, destination, notes } = req.body;

    // Define Email Delivery Targets
    const adminEmail = "your-email@maridadimotors.com"; // WHERE YOU RECEIVE IT
    const japanSupplierEmail = "supplier@japan-car-auctions.co.jp"; // WHERE THE JAPAN PARTNER RECEIVES IT

    // Structured Email Body Content
    const emailHtmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e0e0e0; padding: 24px;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 8px;">New Lead: ${car}</h2>
            <p><strong>Client Identity Details:</strong></p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Contact Phone:</strong> ${phone}</li>
                <li><strong>Client Email:</strong> ${email}</li>
                <li><strong>Target Transit Port Destination:</strong> ${destination}</li>
            </ul>
            <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid #0052CC; margin-top: 16px;">
                <p style="margin: 0; font-weight: bold;">Auction Directives / Logistical Requirements:</p>
                <p style="margin: 8px 0 0 0; color: #444;">${notes || "No custom specifications provided."}</p>
            </div>
            <p style="font-size: 11px; color: #888; margin-top: 24px;">Automated routing engine powered by Maridadi Motors Portal Architecture.</p>
        </div>
    `;

    try {
        // Send email to YOUR inbox
        await transporter.sendMail({
            from: `"Maridadi Inquiries" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `[ADMIN COPY] Inquiry: ${car} - From ${name}`,
            html: emailHtmlContent
        });

        // Send direct parallel mirror copy to the JAPAN supplier inbox
        await transporter.sendMail({
            from: `"Maridadi Funnel Engine" <${process.env.EMAIL_USER}>`,
            to: japanSupplierEmail,
            subject: `[DIRECT IMPORT REQUEST] ${car} - Destination: ${destination}`,
            html: emailHtmlContent
        });

        res.status(200).json({ message: 'Success. Double-routing data transfer completed successfully.' });
    } catch (error) {
        console.error('SMTP Split Routing Engine Fault:', error);
        res.status(500).json({ error: 'Data distribution array failed to complete.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Maridadi Motors engine running securely on port ${PORT}`));
