const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Mail integration network module configurations
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your master server system email address
        pass: process.env.EMAIL_PASSWORD // Secure Google app key password setup
    }
});

// DUAL DESTINATION ROUTING LOGIC PIPELINE
app.post('/api/inquiry', async (req, res) => {
    const { name, email, phone, car, hub, notes } = req.body;

    // DEFINED EMAIL TARGET ENVELOPS ACCORDING TO SYSTEM RULES
    const emailTargetOne = "admin-desk@yourdealership.com";   // Mapped Destination 1 (Local Admin Copy)
    const emailTargetTwo = "tokyo-supply@japan-auctions.jp"; // Mapped Destination 2 (Japan Partner Supplier)

    const compiledHtmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e5e7eb; padding: 0; border-radius: 4px;">
            <div style="background-color: #111111; padding: 24px; text-align: center; border-bottom: 4px solid #0052CC;">
                <h2 style="color: #FFFFFF; margin: 0; font-size: 16px; letter-spacing: 2px; text-transform: uppercase;">System Double-Route Dispatch Log</h2>
            </div>
            <div style="padding: 24px; background-color: #FFFFFF;">
                <h3 style="color: #111111; margin-top: 0;">Target Car Profile: ${car}</h3>
                <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 18px 0;" />
                <p style="font-size: 13px; color: #374151;"><strong>Buyer Information Block:</strong></p>
                <ul style="font-size: 13px; color: #4b5563; line-height: 1.8; padding-left: 20px;">
                    <li><strong>Full Name:</strong> ${name}</li>
                    <li><strong>WhatsApp Primary Phone:</strong> ${phone}</li>
                    <li><strong>Customer Email:</strong> ${email}</li>
                    <li><strong>Target Hub Depot Destination:</strong> ${hub}</li>
                </ul>
                <div style="background-color: #F4F4F6; padding: 16px; border-left: 4px solid #0052CC; margin-top: 20px; border-radius: 2px;">
                    <p style="margin: 0; font-weight: 700; font-size: 11px; color: #111111; text-transform: uppercase;">Logistics Directives / Custom Notes:</p>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${notes || 'No extra criteria parameters defined.'}</p>
                </div>
            </div>
        </div>
    `;

    try {
        // TRIGGER TARGET ONE (Local Admin Processing System Desk)
        await transporter.sendMail({
            from: `"Automated Funnel Link" <${process.env.EMAIL_USER}>`,
            to: emailTargetOne,
            subject: `[LOCAL CORE] Lead Allocation Profile: ${car} - ${name}`,
            html: compiledHtmlContent
        });

        // TRIGGER TARGET TWO (Japan Partner Sourcing Base Terminal)
        await transporter.sendMail({
            from: `"Automated Funnel Link" <${process.env.EMAIL_USER}>`,
            to: emailTargetTwo,
            subject: `[TOKYO LOT REQUEST] Match Sourcing Search: ${car}`,
            html: compiledHtmlContent
        });

        res.status(200).json({ message: 'Success! Form processed and double-route distribution arrays complete.' });
    } catch (error) {
        console.error('SMTP Mail Relay Exception Error:', error);
        res.status(500).json({ error: 'Mail delivery matrix layout assignment fault.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Marketplace Sourcing Matrix operating on port ${PORT}`));
